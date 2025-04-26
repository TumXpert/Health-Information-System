import uuid
from app import db

class Client(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))  # Unique UUID for each client
    full_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    phone_number = db.Column(db.String(15))
    address = db.Column(db.String(255))

    enrollments = db.relationship('Enrollment', back_populates='client', lazy=True)
