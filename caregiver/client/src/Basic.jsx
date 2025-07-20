import * as React from 'react';
import { useState, useContext } from 'react';
import {Form, Button, Stack} from 'react-bootstrap';
import { useNavigate, Outlet, useOutlet } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Styles/basic.scss";




function Basic() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState(null);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [relativePhone, setRelativePhone] = useState('');
    const navigate = useNavigate();
    const outlet = useOutlet(); 
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        dob: null,
        phone: '',
        address: '',
        relativePhone: ''
      });
    
    const handleSubmit = async (event) => {
        event.preventDefault();   
        setFormState({
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            phone: phone,
            address: address,
            relativePhone: relativePhone
        });
            
        await fetch('http://localhost:5000/addPatient', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formState),
        });  
          navigate("/");
        }
        
      return (
            <div className={"basic"}>
                
                <Form onSubmit={handleSubmit}>
                <h1 className='title'>Enter Patient Information</h1>
                <Stack >
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label>Patient First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        <Form.Label>Patient Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group  className="mb-3" controlId="formBasicDob">
                        <Form.Label>Date of Birth</Form.Label>
                        <LocalizationProvider sx={{width:"100%"}} dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker value={dob} onChange={setDob}/>
                        </DemoContainer>
                        </LocalizationProvider>          
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label>Phone</Form.Label>
                        <PhoneInput value={phone} onChange={setPhone}></PhoneInput>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control type="text" placeholder="Street Adress" value={address} onChange={(e) => setAddress(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label>Closest Relative Phone</Form.Label>
                        <PhoneInput value={relativePhone} onChange={setRelativePhone}></PhoneInput>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Patient
                    </Button>
                </Stack>
                </Form>
             <Outlet/>
             </div>
           
  );
}

export default Basic;