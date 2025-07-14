from flask import Flask
from flask_cors import CORS
from app.utils.mongo import init_mongo
from app.routes.project_routes import project_bp
from app.routes.video_routes import video_bp
from app.routes.playlist_routes import playlist_bp
from app.routes.admin_project_routes import admin_project_bp
from app.errors.handlers import register_error_handlers
import os
from flask import Blueprint, jsonify
from app.commands.ingest_and_summarize import run_ingest_and_summarize
from flask import request

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object('config.Config')
    CORS(app, origins=["https://learn-tech-brown.vercel.app/"], supports_credentials=True)

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

    @app.route('/api/cron/ingest', methods=['POST'])
    def trigger_ingest():
        # Optional: Add a simple auth check here for security
        try:
            run_ingest_and_summarize()
            return jsonify({"status": "success"}), 200
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    @app.route('/')
    def home():
        return {"message": "GENAI Backend is running!"}

    return app 