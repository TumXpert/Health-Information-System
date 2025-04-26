from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from app import db
from app.models.enrollment import Enrollment
from app.models.client import Client
from app.models.program import Program

enrollment_bp = Blueprint("enrollment", __name__)

# CREATE enrollment
@enrollment_bp.route('/create', methods=['POST'])
def create_enrollment():
    data = request.get_json()
    required_fields = ['client_id', 'program_id']

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields.'}), 400

    # Check if client and program exist
    client = Client.query.get(data['client_id'])
    program = Program.query.get(data['program_id'])

    if not client or not program:
        return jsonify({'error': 'Client or Program not found.'}), 404

    # Check if client is already enrolled in the program
    existing_enrollment = Enrollment.query.filter_by(client_id=data['client_id'], program_id=data['program_id']).first()
    if existing_enrollment:
        return jsonify({'error': 'Client is already enrolled in this program.'}), 409

    enrollment = Enrollment(
        client_id=data['client_id'],
        program_id=data['program_id'],
        enrollment_date=data.get('enrollment_date', None)  # Use provided date or default to None
    )
    
    db.session.add(enrollment)

    try:
        db.session.commit()
        return jsonify({'message': 'Enrollment created successfully!'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Invalid client_id or program_id.'}), 400

# READ all enrollments
@enrollment_bp.route('/', methods=['GET'])
def get_all_enrollments():
    enrollments = Enrollment.query.all()
    return jsonify([
        {
            'id': e.id,
            'client_id': e.client_id,
            'program_id': e.program_id,
            'enrollment_date': e.enrollment_date.isoformat() if e.enrollment_date else None
        } for e in enrollments
    ]), 200

# READ single enrollment
@enrollment_bp.route('/<int:enrollment_id>/', methods=['GET'])
def get_enrollment(enrollment_id):
    enrollment = Enrollment.query.get(enrollment_id)
    if not enrollment:
        return jsonify({'error': 'Enrollment not found'}), 404

    return jsonify({
        'id': enrollment.id,
        'client_id': enrollment.client_id,
        'program_id': enrollment.program_id,
        'enrollment_date': enrollment.enrollment_date.isoformat() if enrollment.enrollment_date else None
    }), 200

# UPDATE enrollment
@enrollment_bp.route('/<int:enrollment_id>/', methods=['PUT'])
def update_enrollment(enrollment_id):
    enrollment = Enrollment.query.get(enrollment_id)
    if not enrollment:
        return jsonify({'error': 'Enrollment not found'}), 404

    data = request.get_json()

    # Validate and update client_id if provided
    if 'client_id' in data:
        client = Client.query.get(data['client_id'])
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        enrollment.client_id = data['client_id']

    # Validate and update program_id if provided
    if 'program_id' in data:
        program = Program.query.get(data['program_id'])
        if not program:
            return jsonify({'error': 'Program not found'}), 404
        enrollment.program_id = data['program_id']

    # Update enrollment_date if provided
    if 'enrollment_date' in data:
        enrollment.enrollment_date = data['enrollment_date']

    try:
        db.session.commit()
        return jsonify({'message': 'Enrollment updated successfully!'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Failed to update enrollment. Check input values.'}), 400

# DELETE enrollment
@enrollment_bp.route('/<int:enrollment_id>/', methods=['DELETE'])
def delete_enrollment(enrollment_id):
    enrollment = Enrollment.query.get(enrollment_id)
    if not enrollment:
        return jsonify({'error': 'Enrollment not found'}), 404

    db.session.delete(enrollment)
    db.session.commit()
    return jsonify({'message': 'Enrollment deleted successfully!'}), 200

# SEARCH enrollments
@enrollment_bp.route('/search', methods=['GET'])
def search_enrollments():
    client_id = request.args.get('client_id')
    program_id = request.args.get('program_id')

    query = Enrollment.query
    if client_id:
        query = query.filter(Enrollment.client_id == client_id)
    if program_id:
        query = query.filter(Enrollment.program_id == program_id)

    results = query.all()
    return jsonify([
        {
            'id': e.id,
            'client_id': e.client_id,
            'program_id': e.program_id,
            'enrollment_date': e.enrollment_date.isoformat() if e.enrollment_date else None
        } for e in results
    ]), 200

# GET clients eligible for enrollment (not enrolled in all programs)
@enrollment_bp.route('/eligible-clients', methods=['GET'])
def get_eligible_clients():
    try:
        programs = Program.query.all()
        all_clients = Client.query.all()
        eligible_clients = []

        # Check for clients not enrolled in all programs
        for client in all_clients:
            enrolled_program_ids = {
                e.program_id for e in Enrollment.query.filter_by(client_id=client.id).all()
            }

            if len(enrolled_program_ids) < len(programs):
                eligible_clients.append({
                    'id': client.id,
                    'name': client.full_name  # Assuming 'full_name' field in Client model
                })

        return jsonify(eligible_clients), 200
    except Exception as e:
        return jsonify({'error': f"Failed to fetch eligible clients: {str(e)}"}), 500

# GET all available programs
@enrollment_bp.route('/available-programs', methods=['GET'])
def get_available_programs():
    programs = Program.query.all()
    return jsonify([
        {
            'id': program.id,
            'name': program.name
        } for program in programs
    ]), 200
