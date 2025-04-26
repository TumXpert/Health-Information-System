from flask import Blueprint, request, jsonify
from app import db
from app.models.program import Program
from datetime import datetime

program_bp = Blueprint('programs', __name__)

# Helper function to serialize a program
def serialize_program(program):
    return {
        "id": program.id,
        "name": program.name,
        "description": program.description or "",  # Default to empty string if no description
        "start_date": program.start_date.strftime("%Y-%m-%d"),
        "end_date": program.end_date.strftime("%Y-%m-%d"),
        "status": program.status or "Active",  # Ensure a default value for status if it's None
        "is_deleted": program.is_deleted,
        "deleted_at": program.deleted_at.strftime("%Y-%m-%d") if program.deleted_at else None
    }

# Create Program Route
@program_bp.route("/", methods=["POST"])
def create_program():
    data = request.get_json()

    required_fields = ["name", "start_date", "end_date"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields."}), 400

    # Ensure correct date format (YYYY-MM-DD)
    try:
        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
        end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    # Default values for optional fields
    status = data.get("status", "Active")  # Default to "Active" if not provided
    is_deleted = False  # Default to False (program is not deleted)
    deleted_at = None  # Default to None (program is not deleted)

    program = Program(
        name=data["name"],
        description=data.get("description", ""),  # Default empty string if description not provided
        start_date=start_date,
        end_date=end_date,
        status=status,
        is_deleted=is_deleted,
        deleted_at=deleted_at
    )

    db.session.add(program)
    db.session.commit()

    return jsonify({"message": "Program created successfully!"}), 201

# Get All or Filtered Programs with Pagination
@program_bp.route("/", methods=["GET"])
def get_programs():
    query = request.args.get('q', '', type=str)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    status = request.args.get('status', '', type=str)  # Optional status filter
    is_deleted = request.args.get('is_deleted', '', type=str)  # Optional soft delete filter

    base_query = Program.query
    if query:
        base_query = base_query.filter(Program.name.ilike(f"%{query}%"))

    if status:
        base_query = base_query.filter(Program.status == status)

    if is_deleted:
        is_deleted = True if is_deleted.lower() == 'true' else False
        base_query = base_query.filter(Program.is_deleted == is_deleted)

    pagination = base_query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "programs": [serialize_program(p) for p in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    })

# Get Program by ID
@program_bp.route("/<int:program_id>", methods=["GET"])
def get_program_by_id(program_id):
    program = Program.query.get(program_id)
    if not program:
        return jsonify({"error": "Program not found."}), 404
    return jsonify(serialize_program(program))

# Update Program Route
@program_bp.route("/<int:program_id>", methods=["PUT"])
def update_program(program_id):
    data = request.get_json()

    # Retrieve the program to be updated
    program = Program.query.get(program_id)
    if not program:
        return jsonify({"error": "Program not found."}), 404

    # Update fields if provided in request
    if "name" in data:
        program.name = data["name"]
    if "description" in data:
        program.description = data["description"]
    if "start_date" in data:
        try:
            program.start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD."}), 400
    if "end_date" in data:
        try:
            program.end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid end_date format. Use YYYY-MM-DD."}), 400

    if "status" in data:
        if Program.valid_status(data["status"]):
            program.status = data["status"]
        else:
            return jsonify({"error": "Invalid status value. Valid values are 'Active', 'Inactive', 'Pending'."}), 400

    # Prevent direct updates to is_deleted or deleted_at
    if "is_deleted" in data:
        return jsonify({"error": "Cannot update 'is_deleted' directly."}), 400
    if "deleted_at" in data:
        return jsonify({"error": "Cannot update 'deleted_at' directly."}), 400

    # Commit changes to the database
    db.session.commit()

    return jsonify({"message": "Program updated successfully!"})

# Soft Delete Program Route
@program_bp.route("/<int:program_id>", methods=["DELETE"])
def delete_program(program_id):
    program = Program.query.get(program_id)
    if not program:
        return jsonify({"error": "Program not found."}), 404

    program.is_deleted = True
    program.deleted_at = datetime.utcnow()

    db.session.commit()

    return jsonify({"message": "Program soft-deleted successfully!"})

# Search Programs Route
@program_bp.route("/search", methods=["GET"])
def search_programs():
    query = request.args.get('q', '')
    results = Program.query.filter(Program.name.ilike(f"%{query}%")).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description or ""  # Default empty string for missing description
    } for p in results])
