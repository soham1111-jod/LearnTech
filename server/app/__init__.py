from flask import Flask
from flask_cors import CORS
from app.utils.mongo import init_mongo
from app.routes.project_routes import project_bp
from app.routes.video_routes import video_bp
from app.routes.playlist_routes import playlist_bp
from app.routes.admin_project_routes import admin_project_bp
from app.errors.handlers import register_error_handlers
import os

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('config.Config')
    CORS(app, origins=["http://localhost:5173",
        "http://127.0.0.1:5173"], supports_credentials=True)

    # Initialize MongoDB
    init_mongo(app)

    # Register blueprints
    app.register_blueprint(project_bp)
    app.register_blueprint(video_bp)
    app.register_blueprint(playlist_bp)
    app.register_blueprint(admin_project_bp)

    # Register error handlers
    register_error_handlers(app)

    # Register CLI commands
    from app.commands.ingest_and_summarize import ingest_and_summarize_command
    app.cli.add_command(ingest_and_summarize_command)

    @app.route('/')
    def home():
        return {"message": "GENAI Backend is running!"}

    return app 