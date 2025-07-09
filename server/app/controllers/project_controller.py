from app.services.project_service import (
    get_projects_service,
    get_project_by_mongo_id_service
)

def get_projects_controller(request):
    return get_projects_service(request)

def get_project_by_mongo_id_controller(request, mongo_id):
    return get_project_by_mongo_id_service(request, mongo_id) 