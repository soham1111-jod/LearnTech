from app.services.playlist_service import get_playlists_service, add_playlist_service

def get_playlists_controller(request):
    return get_playlists_service(request) 

def add_playlist_controller(request):
    return add_playlist_service(request)