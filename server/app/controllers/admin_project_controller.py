from app.services.admin_project_service import (
    submit_project_service,
    get_pending_projects_service,
    approve_project_service,
    delete_project_service,
    get_approved_projects_service
)

def submit_project_controller(request):
    return submit_project_service(request)

def get_pending_projects_controller(request):
    return get_pending_projects_service(request)

def approve_project_controller(request, project_id):
    return approve_project_service(request, project_id)

def delete_project_controller(request, project_id):
    return delete_project_service(request, project_id)

def get_approved_projects_controller(request):
    return get_approved_projects_service(request) 