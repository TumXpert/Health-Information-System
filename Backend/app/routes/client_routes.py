from flask import Blueprint, request, jsonify
from app import db
from app.models.client import Client
from datetime import datetime

client_bp = Blueprint("client", __name__)

# CREATE client
@client_bp.route("/", methods=["POST"])
def create_client():
    data = request.get_json()
    required_fields = ["full_name", "gender", "date_of_birth"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields."}), 400

    try:
        client = Client(
            full_name=data["full_name"],
            gender=data["gender"],
            date_of_birth=data["date_of_birth"],  # Make sure this is ISO (e.g. "1990-06-15")
            phone_number=data.get("phone_number"),
            address=data.get("address")
        )
        db.session.add(client)
        db.session.commit()

        return jsonify({"message": "Client created successfully!", "id": client.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Helper function to serialize a client
def serialize_client(client):
    return {
        "id": client.id,
        "full_name": client.full_name,
        "gender": client.gender,
        "date_of_birth": client.date_of_birth.isoformat() if client.date_of_birth else None,
        "phone_number": client.phone_number,
        "address": client.address
    }

# READ all or filtered clients with pagination
@client_bp.route("/", methods=["GET"])
def get_clients():
    query = request.args.get('q', '', type=str)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)

    base_query = Client.query
    if query:
        base_query = base_query.filter(
            (Client.full_name.ilike(f"%{query}%")) |
            (Client.phone_number.ilike(f"%{query}%"))
        )

    pagination = base_query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "clients": [serialize_client(c) for c in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    })

# READ a single client
@client_bp.route("/<string:client_id>/", methods=["GET"])
def get_client(client_id):
    client = Client.query.get(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404

    return jsonify({
        "id": client.id,
        "full_name": client.full_name,
        "gender": client.gender,
        "date_of_birth": client.date_of_birth.isoformat() if client.date_of_birth else None,
        "phone_number": client.phone_number,
        "address": client.address
    })

# UPDATE client
@client_bp.route("/<string:client_id>/", methods=["PUT"])
def update_client(client_id):
    client = Client.query.get(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404

    data = request.get_json()
    for field in ["full_name", "gender", "date_of_birth", "phone_number", "address"]:
        if field in data:
            if field == "date_of_birth":
                try:
                    setattr(client, field, datetime.strptime(data[field], "%Y-%m-%d").date())
                except ValueError:
                    return jsonify({"error": "Invalid date_of_birth format. Use YYYY-MM-DD."}), 400
            else:
                setattr(client, field, data[field])

    db.session.commit()
    return jsonify({"message": "Client updated successfully!"})

# DELETE client
@client_bp.route("/<int:client_id>/", methods=["DELETE"])
def delete_client(client_id):
    client = Client.query.get(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404

    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Client deleted successfully!"})
    
@client_bp.route('/search', methods=['GET'])
def search_clients():
    query = request.args.get('q', '')

    results = Client.query.filter(
        (Client.id.ilike(f"%{query}%")) |
        (Client.full_name.ilike(f"%{query}%")) |
        (Client.phone_number.ilike(f"%{query}%"))
    ).all()

    return jsonify([{
        'id': c.id,
        'full_name': c.full_name,
        'gender': c.gender,
        'date_of_birth': c.date_of_birth.isoformat() if c.date_of_birth else None,
        'phone_number': c.phone_number,
        'address': c.address
    } for c in results])

