# routes/dashboard_routes.py

from flask import Blueprint, jsonify
from app import db
from app.models.enrollment import Enrollment
from app.models.client import Client
from app.models.program import Program


dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        # Total counts
        total_programs = Program.query.count()
        total_clients = Client.query.count()
        total_enrollments = Enrollment.query.count()

        # Enrollment distribution by program
        enrollment_distribution = (
            db.session.query(
                Program.name.label('program_name'),
                db.func.count(Enrollment.id).label('enrollment_count')
            )
            .join(Enrollment, Enrollment.program_id == Program.id)
            .group_by(Program.name)
            .all()
        )

        enrollment_data = [
            {
                "programName": item.program_name,
                "enrollmentCount": item.enrollment_count
            }
            for item in enrollment_distribution
        ]

        return jsonify({
            "totalPrograms": total_programs,
            "totalClients": total_clients,
            "totalEnrollments": total_enrollments,
            "enrollmentData": enrollment_data
        }), 200

    except Exception as e:
        print(f"Dashboard fetch error: {e}")
        return jsonify({"message": "Failed to load dashboard data"}), 500
