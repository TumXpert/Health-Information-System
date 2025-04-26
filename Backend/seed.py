from app import create_app, db
from app.models.client import Client
from app.models.program import Program
from app.models.enrollment import Enrollment
from datetime import date

app = create_app()

with app.app_context():
    # Clear existing data
    Enrollment.query.delete()
    Program.query.delete()
    Client.query.delete()

    # Sample Clients
    client1 = Client(
        full_name="Alice Mwangi",
        gender="Female",
        date_of_birth=date(1990, 5, 21),
        phone_number="0712345678",
        address="Nairobi, Kenya"
    )

    client2 = Client(
        full_name="James Otieno",
        gender="Male",
        date_of_birth=date(1985, 9, 10),
        phone_number="0723456789",
        address="Kisumu, Kenya"
    )

    # Sample Programs
    program1 = Program(
        name="Maternal Health",
        description="Support for expectant and new mothers"
    )

    program2 = Program(
        name="HIV Awareness",
        description="Outreach and counseling services"
    )

    db.session.add_all([client1, client2, program1, program2])
    db.session.commit()

    # Sample Enrollments
    enrollment1 = Enrollment(client_id=client1.id, program_id=program1.id)
    enrollment2 = Enrollment(client_id=client2.id, program_id=program2.id)

    db.session.add_all([enrollment1, enrollment2])
    db.session.commit()

    print("🌱 Sample data seeded successfully!")
