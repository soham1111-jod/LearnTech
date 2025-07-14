from flask import Blueprint, request
from app.controllers.playlist_controller import get_playlists_controller, add_playlist_controller



playlist_bp = Blueprint('playlist', __name__, url_prefix='/playlists')

@playlist_bp.route('', methods=['GET'])
def get_playlists():
    return get_playlists_controller(request)

@playlist_bp.route('', methods=['POST'])
def add_playlist():
    return add_playlist_controller(request)