import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Card, CardContent, CardMedia, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import sueImage from './sue.webp';
import hectorImage from './hector.webp';
import hayatoImage from './hayato.webp';

const patientImages = {
    sue: sueImage,
    hector: hectorImage,
    hayato: hayatoImage,
  };
// Dummy data, replace with actual data fetching logic
const patientData = {
    sue: {
        name: "Sue Sand",
        appointmentDate: '25th October 2021',
        heartRate: '90 bpm',
        bodyTemperature: '34.5°C',
        glucoseLevel: '106 mg/dL',
        medicalHistory: 'No known allergies. Previous surgery in 2019.',
        currentMedication: 'Metformin, Vitamin A',
        // ... other patient data
      },
      hector: {
        name: "Hector Death",
        appointmentDate: '25th October 2021',
        heartRate: '91 bpm',
        bodyTemperature: '37.5°C',
        glucoseLevel: '111 mg/dL',
        medicalHistory: 'No known allergies. Previous surgery in 2019.',
        currentMedication: 'Vitamin D, Lisinopril',
        // ... other patient data
      },
      hayato: {
        name: "Hayato Faker",
        appointmentDate: '25th October 2021',
        heartRate: '87 bpm',
        bodyTemperature: '35.5°C',
        glucoseLevel: '100 mg/dL',
        medicalHistory: 'No known allergies. Previous surgery in 2019.',
        currentMedication: 'Vitamin C, Lisinopril',
        // ... other patient data
      },
};

const generateLogRows = (logEntry) => {
    return logEntry.times.map((time, index) => (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          {logEntry.repetition} {time}
        </TableCell>
        <TableCell align="right">{logEntry.response}</TableCell>
      </TableRow>
    ));
  };

const PatientDetail = () => {
    const { name } = useParams(); // Retrieves the name from the URL
    const patientKey = name.toLowerCase(); // Ensure key is in lowercase to match the object keys
  
    // Access the patient data and image using the name from the URL
    const patient = patientData[patientKey] || { name: "Not Found" };
    const image = patientImages[patientKey];

    const logs = [
        { 
          repetition: "Sue asked 'Where's my family?'",
          times: ["(3x) today (12/15/24) at (5:37pm)", "(12/15/24) at (5:38pm)", "(12/15/24) at (5:39pm)"],
          response: "Sue, your family returns from work at 7pm"
        },
        // ... additional log entries
      ];
  return (
        <Box className="patient-detail-container" sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>Patient Details</Typography>
          <Grid container spacing={2} justifyContent="center">
            
            {/* Patient image card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                {image && (
                  <CardMedia
                    component="img"
                    image={image}
                    alt={patient.name}
                    sx={{ height: 'auto', maxWidth: '100%', margin: '0 auto' }} // Center the image
                  />
                )}
              </Card>
            </Grid>
    
            {/* Patient name card, centered */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Card sx={{ textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6">{patient.name}</Typography>
                  <Typography variant="body2">Appointment Date: {patient.appointmentDate}</Typography>

                </CardContent>
              </Card>
            </Grid>

        {/* Vital statistics cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Heart Rate</Typography>
              <Typography variant="body1">{patient.heartRate}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Body Temperature</Typography>
              <Typography variant="body1">{patient.bodyTemperature}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Glucose Level</Typography>
              <Typography variant="body1">{patient.glucoseLevel}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional cards for medical history, current medication, etc. */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Medical History</Typography>
              <Typography variant="body1">{patient.medicalHistory}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Medication</Typography>
              <Typography variant="body1">{patient.currentMedication}</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Repetition Detected</TableCell>
              <TableCell align="right">Response</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((logEntry, index) => generateLogRows(logEntry))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientDetail;
