from app import create_app
from flask_cors import CORS

# Create the Flask app using the factory function
app = create_app()

# Apply CORS to allow requests from localhost:3000
CORS(app, origins=["http://localhost:3000"])

if __name__ == "__main__":
    app.run(debug=True)
