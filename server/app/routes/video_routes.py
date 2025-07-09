from flask import Blueprint, request
from app.controllers.video_controller import (
    get_videos_controller,
    get_video_by_mongo_id_controller
)

video_bp = Blueprint('video', __name__, url_prefix='/videos')

@video_bp.route('', methods=['GET'])
def get_videos():
    return get_videos_controller(request)

@video_bp.route('/mongo/<mongo_id>', methods=['GET'])
def get_video_by_mongo_id(mongo_id):
    return get_video_by_mongo_id_controller(request, mongo_id) 