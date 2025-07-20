import mongoose from 'mongoose';

// Define the schema for the Patient model
const patientSchema = new mongoose.Schema({
    _id: Number, // Using _id to align with the id provided in the database
    name: String,
    medicalHistory: String, // Assuming medical history is stored as a string
    age: Number, // Assuming age is included as part of the patient's details
    conditions: String, // Assuming conditions is stored as a string
    image_id: String,  // Add an image_id field, assumed to be a string representing an image identifier
    address: String,
    relative_num: Number
}, { collection: 'patients' }); // Specify the collection name

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
