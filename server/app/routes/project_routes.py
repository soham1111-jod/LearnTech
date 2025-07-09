from flask import Blueprint, request
from app.controllers.project_controller import (
    get_projects_controller,
    get_project_by_mongo_id_controller
)

project_bp = Blueprint('project', __name__, url_prefix='/projects')

@project_bp.route('', methods=['GET'])
def get_projects():
    return get_projects_controller(request)

@project_bp.route('/mongo/<mongo_id>', methods=['GET'])
def get_project_by_mongo_id(mongo_id):
    return get_project_by_mongo_id_controller(request, mongo_id) 