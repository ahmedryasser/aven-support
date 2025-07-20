import mongoose from 'mongoose';

// Connect to the patient.js schema by including the reference
import Patient from './patient.js'; // Import the Patient model

const logSchema = new mongoose.Schema({
    chat_id: Number,
    messages: {
        message: String,
        response: String
    },
    // patient_id: {
    //     type: mongoose.Schema.Types.Number,
    //     ref: 'Patient' // Reference to the Patient model
    // }
}, { collection: 'chats' }); // Specify the collection name

const Chat = mongoose.model('Chat', logSchema);

export default Chat;
