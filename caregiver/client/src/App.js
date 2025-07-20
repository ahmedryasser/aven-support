import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import sueImage from './sue.webp';
import hectorImage from './hector.webp';
import hayatoImage from './hayato.webp';
import nursePamImage from './nursepam.webp'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {Button, Typography} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Basic from './Basic';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDetail from './patient';
const Patient = ({ name, imageUrl }) => {
  return (
    <div className="patient">
      <Link to={`/patient/${name.toLowerCase()}`}>
        <div className="patient-image-container">
          <img src={imageUrl} alt={name} className="patient-image" />
        </div>
        <p>{name}</p>
      </Link>
    </div>
  );
};

const Home = () => {
  const [patients, setPatients] = useState([
    // Fallback patient data
    { name: 'Sue', imageUrl: sueImage },
    { name: 'Hector', imageUrl: hectorImage },
    { name: 'Hayato', imageUrl: hayatoImage },
  ]);
  useEffect(() => {
    fetch('http://localhost:8080/patients')
      .then(response => response.json())
      .then(data => {
        setPatients(data.map(patient => ({
          name: patient._id.toString(),  // Assuming patient's name is stored under _id
          imageUrl: patient.image_id // Map correct field for the image URL
        })));
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

    // { name: 'Susan', imageUrl: susanImage },
    // ...other patients
  
  const Navigate = useNavigate();
  const addNewPatient = () => {
    // Add a new patient to the list
    Navigate("../patient/new_patient")
  };
  return (
    <div className="home">
      <Typography variant='h4' >Welcome Caregiver</Typography>
      <br/>
      <Typography variant='h6'>Select a patient: </Typography>
      <div className="patient-list">
        {patients.map(patient => (
          <Patient key={patient.name} name={patient.name} imageUrl={patient.imageUrl} />
        ))}
        {/* Render your plus button here for adding new patients */}
        <Button onClick={addNewPatient} sx={{height: "80px", width: "80px", borderRadius:"50%"}} variant="contained" color="primary">+</Button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <header style={{borderBottomRightRadius:"10px", borderBottomLeftRadius:"10px"}}  className="App-header">
          <div className="Login-info">
            <span style={{marginRight:"5px"}}>Welcome back Nurse Pam! </span>
            <img src={nursePamImage} alt="Nurse Pam"  className="Profile-image" />
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient/new_patient" element={<Basic />} />
          <Route path="/patient/:name" element={<PatientDetail />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
