from app import db

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.String(36), db.ForeignKey('client.id'), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('program.id'), nullable=False)
    enrollment_date = db.Column(db.Date, default=db.func.current_date())

    client = db.relationship('Client', back_populates='enrollments')
    program = db.relationship('Program', back_populates='enrollments')
