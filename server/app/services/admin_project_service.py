from flask import jsonify, request
from app.utils.mongo import get_projects_collection
from app.middlewares.auth import require_admin_token
from datetime import datetime
import re
import os

ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', 'changeme')

def validate_project(data):
    required_fields = ['title', 'description', 'tech_stack', 'github_url', 'demo_url', 'linkedin']
    for field in required_fields:
        if not data.get(field):
            return False, f"Missing field: {field}"
    url_fields = ['github_url', 'demo_url', 'linkedin']
    url_regex = re.compile(r'^https?://')
    for field in url_fields:
        if not url_regex.match(data[field]):
            return False, f"Invalid URL in {field}"
    return True, None

def submit_project_service(request):
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        valid, error = validate_project(data)
        if not valid:
            return jsonify({'error': error}), 400
        projects_collection = get_projects_collection()
        duplicate = projects_collection.find_one({
            '$or': [
                {'github_url': data['github_url'].strip()},
                {'title': data['title'].strip()}
            ],
            'status': {'$in': ['pending', 'approved']}
        })
        if duplicate:
            return jsonify({'error': 'A project with this title or GitHub URL has already been submitted.'}), 409
        project = {
            'title': data['title'].strip(),
            'description': data['description'].strip(),
            'tech_stack': [tech.strip() for tech in data['tech_stack']],
            'github_url': data['github_url'].strip(),
            'demo_url': data['demo_url'].strip(),
            'linkedin': data['linkedin'].strip(),
            'status': 'pending',
            'created_at': datetime.utcnow()
        }
        result = projects_collection.insert_one(project)
        return jsonify({'message': 'Project submitted for review', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        print(f"Error in submit_project: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

def get_pending_projects_service(request):
    auth = require_admin_token(request)
    if auth:
        return auth
    projects_collection = get_projects_collection()
    projects = list(projects_collection.find({'status': 'pending'}))
    for p in projects:
        p['_id'] = str(p['_id'])
    return jsonify(projects)

def approve_project_service(request, project_id):
    auth = require_admin_token(request)
    if auth:
        return auth
    from bson.objectid import ObjectId
    projects_collection = get_projects_collection()
    result = projects_collection.update_one({'_id': ObjectId(project_id)}, {'$set': {'status': 'approved'}})
    if result.matched_count == 0:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify({'message': 'Project approved'})

def delete_project_service(request, project_id):
    auth = require_admin_token(request)
    if auth:
        return auth
    from bson.objectid import ObjectId
    projects_collection = get_projects_collection()
    result = projects_collection.delete_one({'_id': ObjectId(project_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify({'message': 'Project deleted'})

def get_approved_projects_service(request):
    projects_collection = get_projects_collection()
    projects = list(projects_collection.find({'status': 'approved'}))
    for p in projects:
        p['_id'] = str(p['_id'])
    return jsonify(projects) 