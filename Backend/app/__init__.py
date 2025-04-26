from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Load environment variables
    load_dotenv()

    # Create the Flask app
    app = Flask(__name__)

    # Apply CORS with a specific origin
    CORS(app, origins=["http://localhost:3000"])

    # Load configuration from app.config
    app.config.from_object("app.config.Config")

    # Initialize database and migration support
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.routes.client_routes import client_bp
    from app.routes.program_routes import program_bp
    from app.routes.enrollment_routes import enrollment_bp
    from app.routes.dashboard_routes import dashboard_bp

    app.register_blueprint(client_bp, url_prefix="/api/clients")
    app.register_blueprint(program_bp, url_prefix="/api/programs")
    app.register_blueprint(enrollment_bp, url_prefix="/api/enrollments")
    app.register_blueprint(dashboard_bp)

    return app
