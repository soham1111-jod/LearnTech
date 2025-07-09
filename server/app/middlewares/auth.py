import os
from flask import jsonify

def require_admin_token(request):
    token = request.headers.get('Authorization')
    admin_token = os.getenv('ADMIN_TOKEN')

    if token != f"Bearer {admin_token}":
        return jsonify({'error': 'Unauthorized'}), 401

    return None
