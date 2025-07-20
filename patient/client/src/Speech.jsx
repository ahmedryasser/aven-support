import { useContext, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import {
    Box,
    Button,
    IconButton,Stack,
    Typography
} from "@mui/material";
import watchBackground from "./media/watchBackground.webp";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import axios from "axios";


function Speech() {
    const [recording, setRecording] = useState(false);
    const [response, setResponse] = useState(''); 
    const silenceTimer = useRef(null);
    const silenceTimeoutMs = 2000; 
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
        resetTranscript,
        startListening,
        stopListening,
    } = useSpeechRecognition();

    const startSpeechRecognition = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
        setRecording(true);
        resetSilenceTimer();
    };

    const endSpeechRecognition = () => {
        SpeechRecognition.stopListening();
        setRecording(false);
        clearSilenceTimer();
        console.log("endSpeechRecognition: ", transcript);
        handleMessageSend();
    };

    const resetSilenceTimer = () => {
        clearSilenceTimer();
        silenceTimer.current = setTimeout(() => {
            console.log("Silence detected, stopping recognition");
            endSpeechRecognition();
        }, silenceTimeoutMs);
    };

    const clearSilenceTimer = () => {
        if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
            silenceTimer.current = null;
        }
    };

    useEffect(() => {
        if (listening) {
            resetSilenceTimer();
        }
    }, [transcript, listening]);

    useEffect(() => {
        return () => clearSilenceTimer();
    }, []);
    const speak = (response) => {
        if (!speechSynthesis) {
            console.error('Speech synthesis not supported');
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(response);
        speechSynthesis.speak(utterance);
    }
    const handleMessageSend = () => {
            const payload = {
            input: transcript,
        };
        const url = `http://localhost:5000/chat`;

        axios
            .post(url, payload)
            .then((response) => {
                setResponse(response.data.response);
                speak(response.data.response);
            })
            .catch((error) => {
                //addMessage("message", true, "Sorry, there was a problem processing your request. Please try again.", new Date());
                setResponse( "Error: " + error);
                
                console.error("There was an error!", error.response);
            });
    };
    return (
        <>
        <Stack justifyContent={"center"} alignItems={"center"} height={"100vh"} className="speech" sx={{backgroundImage: `url(${watchBackground})`, backgroundSize: "cover", height: "100%", width: "100%",backgroundPosition:"center"}} >
            <br/>
            {!recording && (
                <IconButton onClick={startSpeechRecognition}>
                    <PlayCircleIcon sx={{width:"250px", position:"relative", height:"250px", top: "-10px", color: "" }}/>
                </IconButton>
            )}
            {recording && (
                <IconButton onClick={endSpeechRecognition}>
                    <StopCircleIcon sx={{ width:"250px", position:"relative", height:"250px", top: "-10px" ,color: "red" }} />
                </IconButton>
            )}
            <br />

            <Box bottom={"0"} justifyContent={"center"} width={"70%"} height={"45px"} overflow={"hidden"} borderRadius={"10px"} position={"absolute"} marginBottom={"30px"} sx={{backgroundColor:"white"}}>
                {recording && (<Typography variant='h5'> {transcript}</Typography>)} {!recording && (<Typography variant='h4'> {response}</Typography>)}
            </Box>
        </Stack>
        </>
      
    );
  }
  
  export default Speech;
  