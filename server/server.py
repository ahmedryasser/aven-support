from flask import Flask, request, jsonify, abort
from openai import OpenAI, APIError
from flask_cors import CORS
import os
import psycopg2
from jsonschema import validate, ValidationError
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

CREATE_TABLE = """CREATE TABLE IF NOT EXISTS form_data (id SERIAL PRIMARY KEY, firstName VARCHAR(255), lastName VARCHAR(255),gender VARCHAR(255), dob VARCHAR(255), phone VARCHAR(255), streetAddress VARCHAR(255), city VARCHAR(255), UsState VARCHAR(255), zipcode VARCHAR(255), guardianFirstName VARCHAR(255), guardianLastName VARCHAR(255), relationship VARCHAR(255), guardianPhone VARCHAR(255),  other VARCHAR(255), signaturePhoto bytea );"""
GET_PATIENT_DATA = """SELECT * FROM form_data WHERE id = %s;"""  # SQL query to get patient data by ID

INSERT_DATA = """INSERT INTO form_data (firstName, lastName, gender, dob, phone, streetAddress, city, UsState, zipcode, guardianFirstName, guardianLastName, relationship, guardianPhone, other,signaturePhoto) VALUES (%s, %s, %s,%s, %s, %s,%s, %s, %s,%s, %s, %s,%s, %s, %s);"""

schema = {
    "type" : "object",
    "properties" : {
        "firstName" : {"type" : "string"},
        "lastName" : {"type" : "string"},
        "dob" : {"type" : "string"},
        "phone" : {"type" : "string"},
        "address" : {"type" : "string"},
        "relativeNumber" : {"type" : "string"},
    },
    "required": ["firstName", "lastName", "dob", "phone", "address", "relativeNumber"]
}

load_dotenv()
app = Flask(__name__)
url = os.getenv('DATABASE_URL')
API_KEY = os.getenv('OPENAI_API_KEY')
connection = psycopg2.connect(url)
CORS(app)  
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/addPatient', methods=['POST'])
def submit_form():
    data = request.json
    try:
        validate(instance=data, schema=schema)
    except ValidationError as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    
    with connection.cursor() as cursor:
        cursor.execute(CREATE_TABLE)
        connection.commit()
        cursor.execute(INSERT_DATA, (data['firstName'], data['lastName'], data['dob'], data['phone'], data['address'], data['relativeNumber']))
        connection.commit()
    return jsonify({'status': 'success', 'data': data})
@app.route('/getPatient/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    with connection.cursor() as cursor:
        cursor.execute(GET_PATIENT_DATA, (patient_id,))
        patient = cursor.fetchone()
        if patient:
            # Assuming the cursor returns a tuple of data, you'll want to format this
            # into a dictionary or similar structure to return as JSON
            patient_data = {
                "firstName": patient[1],
                "lastName": patient[2],
                "gender": patient[3],
                "dob": patient[4],
                # ...continue for the rest of the fields
            }
            return jsonify({'status': 'success', 'data': patient_data})
        else:
            return jsonify({'status': 'error', 'message': 'Patient not found'}), 404client = OpenAI(api_key="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")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    input_text = data.get('input')

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a kind caregiver for a dementia patient. Answer the following questions to the best of your ability..."},
                {"role": "user", "content": input_text}
            ]
        )
        response_message = completion.choices[0].message.content
        
        return jsonify({"response": response_message})
    except APIError as e:
        return jsonify({"error": "API error", "message": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500



if __name__ == '__main__':
    app.run(port=5000)
