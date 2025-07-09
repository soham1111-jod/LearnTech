import click
from flask.cli import with_appcontext
import os
from app.utils.mongo import get_videos_collection, get_playlists_collection
from youtube_transcript_api import YouTubeTranscriptApi
import requests
from dotenv import load_dotenv
from googleapiclient.discovery import build
import logging
import time
import math
import isodate
from datetime import datetime

# --- CONFIG ---
load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 3000))
BATCH_SIZE = int(os.getenv("BATCH_SIZE", 5))
MIN_VIDEO_DURATION_SEC = 30

# --- LOGGING ---
logging.basicConfig(filename='ingest_errors.log', level=logging.ERROR, format='%(asctime)s %(levelname)s:%(message)s')
console = logging.StreamHandler()
console.setLevel(logging.INFO)
logging.getLogger().addHandler(console)

def check_env_vars():
    missing = []
    for var in ["YOUTUBE_API_KEY", "GEMINI_API_KEY"]:
        if not os.getenv(var):
            missing.append(var)
    if missing:
        raise EnvironmentError(f"Missing required environment variables: {', '.join(missing)}")

def fetch_playlist_videos(youtube, playlist_id):
    videos = []
    nextPageToken = None
    while True:
        try:
            pl_request = youtube.playlistItems().list(
                part="snippet,contentDetails",
                playlistId=playlist_id,
                maxResults=50,
                pageToken=nextPageToken
            )
            pl_response = pl_request.execute()
        except Exception as e:
            logging.error(f"YouTube API error for playlist {playlist_id}: {e}")
            if hasattr(e, 'resp') and hasattr(e.resp, 'status') and e.resp.status == 403:
                logging.error("Quota limit reached for YouTube API.")
                break
            return []
        for item in pl_response['items']:
            video_id = item['contentDetails']['videoId']
            title = item['snippet']['title']
            published_at = item['contentDetails'].get('videoPublishedAt', item['snippet']['publishedAt'])
            videos.append({
                "videoId": video_id,
                "title": title,
                "publishedAt": published_at
            })
        nextPageToken = pl_response.get('nextPageToken')
        if not nextPageToken:
            break
    return videos

def fetch_video_details(youtube, video_id):
    try:
        vid_request = youtube.videos().list(
            part="contentDetails,snippet",
            id=video_id
        )
        vid_response = vid_request.execute()
    except Exception as e:
        logging.error(f"YouTube API error for video {video_id}: {e}")
        if hasattr(e, 'resp') and hasattr(e.resp, 'status') and e.resp.status == 403:
            logging.error("Quota limit reached for YouTube API.")
        return None
    if not vid_response['items']:
        return None
    item = vid_response['items'][0]
    duration = item['contentDetails']['duration']  # ISO 8601 format
    # Convert ISO 8601 duration to HH:MM:SS
    try:
        duration_sec = int(isodate.parse_duration(duration).total_seconds())
        h = duration_sec // 3600
        m = (duration_sec % 3600) // 60
        s = duration_sec % 60
        duration_str = f"{h:02}:{m:02}:{s:02}" if h else f"{m:02}:{s:02}"
    except Exception as e:
        logging.error(f"Error parsing duration for {video_id}: {e}")
        duration_str = ""
        duration_sec = 0
    tags = item['snippet'].get('tags', [])
    return {
        "duration": duration_str,
        "duration_sec": duration_sec,
        "tags": tags,
        "description": item['snippet'].get('description', ''),
        "youtubeUrl": f"https://youtu.be/{video_id}"
    }

def fetch_transcript(video_id):
    try:
        # Try English first
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
            return transcript
        except Exception:
            # Try Hindi if English is not available
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['hi'])
            return transcript
    except Exception as e:
        logging.error(f"Transcript not available for {video_id}: {e}")
        return None

def transcript_to_text(transcript):
    return " ".join([item['text'] for item in transcript])

def chunk_transcript(transcript, chunk_size=CHUNK_SIZE):
    words = []
    for item in transcript:
        words.extend(item['text'].split())
    total_words = len(words)
    # Roughly estimate 1 token ≈ 0.75 words
    words_per_chunk = int(chunk_size * 0.75)
    return [" ".join(words[i:i+words_per_chunk]) for i in range(0, total_words, words_per_chunk)]

def summarize_with_gemini(text, title):
    prompt = f"Summarize the following YouTube video transcript for the video titled '{title}' in less than 200 words.\n\n{text}\n\nSummary:"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=payload,
            timeout=30
        )
        if response.status_code == 403:
            logging.error("Quota limit reached for Gemini API.")
            print("Quota limit reached for Gemini API.")
            raise Exception(f"Gemini API quota error: HTTP 403")
        if response.status_code != 200:
            logging.error(f"Gemini API error: HTTP {response.status_code} - {response.text}")
            print(f"Gemini API error: HTTP {response.status_code} - {response.text}")
            raise Exception(f"Gemini API error: HTTP {response.status_code}")
        data = response.json()
        if "candidates" in data and data["candidates"] and "content" in data["candidates"][0] and "parts" in data["candidates"][0]["content"] and data["candidates"][0]["content"]["parts"]:
            summary = data["candidates"][0]["content"]["parts"][0]["text"]
            print(f"Gemini summary: {summary[:200]}...")
            return summary
        else:
            logging.error(f"Gemini API error for text chunk: {data}")
            print(f"Gemini API error for text chunk: {data}")
            return None
    except requests.Timeout:
        logging.error("Gemini API request timed out.")
        print("Gemini API request timed out.")
        raise Exception("Gemini API request timed out.")
    except Exception as e:
        logging.error(f"Gemini API request failed: {e}")
        print(f"Gemini API request failed: {e}")
        raise

def combine_summaries_in_batches(chunk_summaries, title, batch_size=5):
    # Combine summaries in batches to avoid token overflow
    combined = chunk_summaries
    while len(combined) > 1:
        new_combined = []
        for i in range(0, len(combined), batch_size):
            batch = combined[i:i+batch_size]
            joined = " ".join(batch)
            summary = summarize_with_gemini(joined, title)
            if summary:
                new_combined.append(summary)
            else:
                new_combined.append(joined)  # fallback to raw if summarization fails
        combined = new_combined
    return combined[0] if combined else None

def classify_video_type(title):
    prompt = (
        "Classify the following YouTube video title as one of: concept or project.\n"
        f"Title: {title}\n"
        "Type:"
    )
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=payload,
            timeout=30
        )
        if response.status_code == 429:
            logging.error("Gemini API quota exceeded. Falling back to heuristic.")
            if "project" in title.lower():
                return "project"
            return "concept"
        if response.status_code != 200:
            logging.error(f"Gemini API error (classification): HTTP {response.status_code} - {response.text}")
            if "project" in title.lower():
                return "project"
            return "concept"
        data = response.json()
        if "candidates" in data and data["candidates"]:
            type_text = data["candidates"][0]["content"]["parts"][0]["text"].strip().lower()
            allowed_types = {"concept", "project"}
            return type_text if type_text in allowed_types else "concept"
    except Exception as e:
        logging.error(f"Type classification failed: {e}")
        if "project" in title.lower():
            return "project"
        return "concept"

def run_ingest_and_summarize():
    check_env_vars()
    youtube = build('youtube', 'v3', developerKey=os.getenv("YOUTUBE_API_KEY"))
    processed = 0
    # Fetch all active playlists from MongoDB
    active_playlists = list(get_playlists_collection().find({"active": True}))
    if not active_playlists:
        print("No active playlists found in the database.")
        return
    for playlist in active_playlists:
        playlist_id = playlist.get("playlistId")
        if not playlist_id:
            print(f"Skipping playlist with missing playlistId: {playlist}")
            continue
        print(f"Processing playlist: {playlist_id}")
        playlist_videos = fetch_playlist_videos(youtube, playlist_id)
        for vid in playlist_videos:
            if processed >= BATCH_SIZE:
                print(f"Batch size {BATCH_SIZE} reached, stopping for now.")
                return
            # Check if video already exists in MongoDB
            if get_videos_collection().find_one({"videoId": vid["videoId"]}):
                print(f"Video {vid['videoId']} already in DB, skipping.")
                continue
            # Fetch more details
            details = fetch_video_details(youtube, vid["videoId"])
            if not details:
                print(f"Could not fetch details for {vid['videoId']}, skipping.")
                continue
            # Minimum duration check
            if details.get('duration_sec', 0) < MIN_VIDEO_DURATION_SEC:
                print(f"Video {vid['videoId']} is too short ({details.get('duration_sec', 0)}s), skipping.")
                continue
            # Classify video type using Gemini and title
            video_type = classify_video_type(vid["title"])
            # Remove description from details if present
            if "description" in details:
                del details["description"]
            # Parse publishedAt to datetime object if possible
            published_at = vid.get("publishedAt")
            if published_at:
                try:
                    dt = datetime.strptime(published_at.replace('Z', ''), "%Y-%m-%dT%H:%M:%S")
                    vid["publishedAt"] = dt
                except Exception as e:
                    logging.error(f"Failed to parse publishedAt: {published_at} ({e})")
            # Merge all metadata
            video_doc = {**vid, **details, "type": video_type, "playlistId": playlist_id}
            # Insert into MongoDB
            get_videos_collection().insert_one(video_doc)
            print(f"Inserted {vid['videoId']} into DB with type '{video_type}'.")
            # Fetch transcript and summarize
            transcript = fetch_transcript(vid["videoId"])
            if not transcript:
                print(f"No transcript for {vid['videoId']}, skipping summarization.")
                continue
            # Chunk transcript if needed
            chunks = chunk_transcript(transcript)
            chunk_summaries = []
            for idx, chunk in enumerate(chunks):
                print(f"Summarizing chunk {idx+1}/{len(chunks)} for {vid['videoId']}...")
                summary = None
                for attempt in range(3):
                    try:
                        summary = summarize_with_gemini(chunk, vid["title"])
                        if summary:
                            break
                    except Exception as e:
                        print(f"Retry {attempt+1}/3 failed for chunk {idx+1}: {e}")
                        time.sleep(5)
                if summary:
                    chunk_summaries.append(summary)
                else:
                    logging.error(f"Failed to summarize chunk {idx+1} for {vid['videoId']}")
                    print(f"Failed to summarize chunk {idx+1} for {vid['videoId']}")
                time.sleep(1)  # Avoid hitting rate limits
            if not chunk_summaries:
                print(f"No summaries generated for {vid['videoId']}")
                continue
            # Combine chunk summaries into a final summary if needed
            if len(chunk_summaries) == 1:
                final_summary = chunk_summaries[0]
            else:
                print(f"Combining {len(chunk_summaries)} chunk summaries for {vid['videoId']}...")
                final_summary = combine_summaries_in_batches(chunk_summaries, vid["title"])
            if not final_summary:
                print(f"Failed to generate final summary for {vid['videoId']}")
                continue
            get_videos_collection().update_one(
                {"videoId": vid["videoId"]},
                {"$set": {"summary": final_summary}}
            )
            print(f"Summary saved for {vid['videoId']}")
            processed += 1
            time.sleep(1)  # Avoid rate limits

@click.command('ingest_and_summarize')
@with_appcontext
def ingest_and_summarize_command():
    """Fetch and summarize videos using Gemini."""
    run_ingest_and_summarize() 