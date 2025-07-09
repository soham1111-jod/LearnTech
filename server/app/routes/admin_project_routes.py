from flask import Blueprint, request
from app.controllers.admin_project_controller import (
    submit_project_controller,
    get_pending_projects_controller,
    approve_project_controller,
    delete_project_controller,
    get_approved_projects_controller
)

admin_project_bp = Blueprint('admin_project', __name__, url_prefix='/api/projects')

@admin_project_bp.route('/submit', methods=['POST'])
def submit():
    return submit_project_controller(request)

@admin_project_bp.route('/pending', methods=['GET'])
def pending():
    return get_pending_projects_controller(request)

@admin_project_bp.route('/<project_id>/approve', methods=['PATCH'])
def approve(project_id):
    return approve_project_controller(request, project_id)

@admin_project_bp.route('/<project_id>', methods=['DELETE'])
def delete(project_id):
    return delete_project_controller(request, project_id)

@admin_project_bp.route('/approved', methods=['GET'])
def approved():
    return get_approved_projects_controller(request) 