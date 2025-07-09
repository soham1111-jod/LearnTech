from app.services.playlist_service import get_playlists_service

def get_playlists_controller(request):
    return get_playlists_service(request) 