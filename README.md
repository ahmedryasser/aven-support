# Aven Customer Support System
![image](https://github.com/ahmedryasser/Anaphorna/assets/56661044/65e7e5a0-9ad1-46e4-beb7-e913d39e82f6)

## Description:
Anaphora is a web-based simulation of a wearable watch designed to help dementia patients by answering their questions and detecting repetitive behavior. The system provides caregivers with a comprehensive CRUD interface to manage patient information and monitor patient repetitions and vitals. This project was took 24 hours to build.


## Features
### Simulated Watch App
- Answers patient questions using the OpenAI ChatGPT API.
- Detects repetitive behavior and notifies caregivers.
- Pulls relevant information from a patient's database (name, address, etc.).

  
<img width="958" alt="Watch screenshot" src="https://github.com/ahmedryasser/Anaphora/assets/56661044/be1a7f11-5203-422e-b175-8eb316823c9b">

### CRUD System for Caregivers
- Allows caregivers to manage patient data.
- Tracks repetitions, vitals, and other behavioral patterns.
- Generates comprehensive reports for effective patient care.
<img width="959" alt="Caregiver" src="https://github.com/ahmedryasser/Anaphora/assets/56661044/59a5c0cf-4473-4372-a506-a9415e96f5d4">

## Tech Stack
### Frontend
- React.js: Web user interface framework
- Material UI: Component library for styling
### Backend
- Flask: Python web framework for building APIs
- PostgreSQL: Relational database for patient information
## Additional Tools
OpenAI ChatGPT API: Conversational language model for answering patient questions
AWS: Hosting database
## Getting Started
Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL

### Running patient client
- npm i
- navigate to patient/client
- npm start

### Running caregiver client
- npm i
- navigate to caregiver/client
- npm start

### Running server
Optional
- python3 -m venv venv 
- source venv/bin/activate
  
Required
- navigate to server
- pip install -r requirements.txt
- python server.py
