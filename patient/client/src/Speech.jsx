 // Speech.jsx - Main component
import { useState, useRef, useEffect, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {
  Box,
  Typography,
  Alert,
  Container,
  Paper,
  Grid
} from "@mui/material";
import axios from "axios";
import TalkingAvatar from "./TalkingAvatar";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StatusIndicators from "./components/StatusIndicators";
import VoiceInput from "./components/VoiceInput";
import CurrentConversation from "./components/CurrentConversation";
import ConversationHistory from "./components/ConversationHistory";

function Speech() {
  // State management
  const [recording, setRecording] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [talking, setTalking] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  
  // Refs and timers
  const silenceTimer = useRef(null);
  const silenceTimeoutMs = 2000;
  
  // Speech recognition
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // Speech recognition functions
  const startSpeechRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      setError("Speech recognition is not supported in this browser");
      return;
    }
    
    resetTranscript();
    setError("");
    SpeechRecognition.startListening({ continuous: true });
    setRecording(true);
    resetSilenceTimer();
  };

  const endSpeechRecognition = () => {
    SpeechRecognition.stopListening();
    setRecording(false);
    clearSilenceTimer();
    if (transcript.trim()) {
      handleMessageSend(transcript);
    }
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimer.current = setTimeout(() => {
      endSpeechRecognition();
    }, silenceTimeoutMs);
  };

  const clearSilenceTimer = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  // Text-to-speech function
  const speak = useCallback((text) => {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;

    const doSpeak = () => {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);

      const voices = synth.getVoices();
      if (voices.length) {
        utter.voice =
          voices.find(v => v.lang.includes("en") && (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark") || v.name.toLowerCase().includes("daniel"))) ||
          voices.find(v => v.lang.includes("en") && v.name.includes("Google") && v.name.toLowerCase().includes("us")) ||
          voices.find(v => v.lang.includes("en")) ||
          voices[0];
      }

      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 1;
      utter.onstart = () => setTalking(true);
      utter.onend = () => setTalking(false);
      utter.onerror = () => setTalking(false);

      synth.speak(utter);
    };

    if (synth.getVoices().length === 0) {
      const handle = () => {
        doSpeak();
        synth.removeEventListener("voiceschanged", handle);
      };
      synth.addEventListener("voiceschanged", handle);
    } else {
      doSpeak();
    }
  }, []);

  // Message handling
  const handleMessageSend = async (inputText) => {
    if (!inputText.trim()) return;
    
    const userMessage = { type: 'user', message: inputText, timestamp: new Date() };
    setConversationHistory(prev => [...prev, userMessage]);
    
    setLoading(true);
    setError("");
    
    try {
      const payload = { input: inputText };
      const url = `http://localhost:5000/chat`;

      const res = await axios.post(url, payload);
      const botResponse = res.data.response;
      setResponse(botResponse);
      
      const botMessage = { type: 'bot', message: botResponse, timestamp: new Date() };
      setConversationHistory(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error("API Error:", error);
      setError(error.response?.data?.message || "Failed to get response from server");
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (response) speak(response);
  }, [response, speak]);

  useEffect(() => {
    const greeting = "Hi! I'm Dave, your virtual customer support assistant. How can I help you with your Aven account today?";
    const timer = setTimeout(() => {
      speak(greeting);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [speak]);

  useEffect(() => {
    if (listening) {
      resetSilenceTimer();
    }
  }, [transcript, listening]);

  useEffect(() => {
    return () => clearSilenceTimer();
  }, []);

  // Browser support check
  if (!browserSupportsSpeechRecognition) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
          Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Sidebar onQuickAction={handleMessageSend} />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1565c0', mb: 3 }}>
                Virtual Assistant Support
              </Typography>
              
              <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
                Hi! I'm Dave, your virtual customer support assistant. How can I help you with your Aven account today?
              </Typography>

              <StatusIndicators 
                recording={recording} 
                talking={talking} 
                loading={loading} 
              />

              {/* Avatar */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <TalkingAvatar text={response} talking={talking} />
                </Paper>
              </Box>

              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <VoiceInput
                recording={recording}
                loading={loading}
                textInput={textInput}
                setTextInput={setTextInput}
                onStartRecording={startSpeechRecognition}
                onStopRecording={endSpeechRecognition}
                onSendMessage={handleMessageSend}
              />

              <CurrentConversation
                recording={recording}
                transcript={transcript}
                response={response}
              />

              <ConversationHistory
                conversationHistory={conversationHistory}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Speech;