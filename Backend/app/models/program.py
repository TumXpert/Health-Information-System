from app import db
from datetime import datetime

# Enum or constants for valid status values
VALID_STATUSES = ["Active", "Inactive", "Pending"]

class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(50), nullable=False, default="Active")  # Status field
    is_deleted = db.Column(db.Boolean, default=False)  # Soft delete flag
    deleted_at = db.Column(db.DateTime, nullable=True)  # Soft deletion timestamp (optional)
    
    # Relationship to Enrollment model
    enrollments = db.relationship('Enrollment', back_populates='program', lazy=True)

    def __repr__(self):
        return f'<Program {self.name}>'

    @staticmethod
    def valid_status(status):
        """Check if the status is valid"""
        return status in VALID_STATUSES


# Helper function to serialize a program for JSON responses
def serialize_program(program):
    return {
        "id": program.id,
        "name": program.name,
        "description": program.description,
        "start_date": program.start_date.strftime("%Y-%m-%d") if program.start_date else None,
        "end_date": program.end_date.strftime("%Y-%m-%d") if program.end_date else None,
        "status": program.status,
        "is_deleted": program.is_deleted,
        "deleted_at": program.deleted_at.strftime("%Y-%m-%d %H:%M:%S") if program.deleted_at else None
    }

