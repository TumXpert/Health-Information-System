from flask import Flask, send_file, jsonify
import io

app = Flask(__name__)

@app.route('/api/reports/generate', methods=['GET'])
def generate_report():
    # Dummy CSV content
    csv_content = "Name,Email,Program\nJohn Doe,john@example.com,Program A\nJane Smith,jane@example.com,Program B"

    # Create a bytes buffer
    buffer = io.BytesIO()
    buffer.write(csv_content.encode())
    buffer.seek(0)

    return send_file(
        buffer,
        mimetype='text/csv',
        as_attachment=True,
        download_name='enrollment_report.csv'
    )

if __name__ == '__main__':
    app.run(debug=True)
