// App.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  Container,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import {
  StopCircle as StopCircleIcon,
  PlayCircle as PlayCircleIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Send as SendIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from "@mui/icons-material";
import axios from "axios";
import TalkingAvatar from "./TalkingAvatar";

function Speech() {
  const [recording, setRecording] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [talking, setTalking] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const silenceTimer = useRef(null);
  const silenceTimeoutMs = 2000;
  
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

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

  /* --------------------------------------------------
     Reliable Text-to-Speech helper
  -------------------------------------------------- */
  const speak = useCallback((text) => {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;

    const doSpeak = () => {
      synth.cancel();                         // stop anything already playing
      const utter = new SpeechSynthesisUtterance(text);

      // choose a clear English voice if possible
      const voices = synth.getVoices();
      if (voices.length) {
        utter.voice =
          // First try to find a male English voice
          voices.find(v => v.lang.includes("en") && (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark") || v.name.toLowerCase().includes("daniel"))) ||
          // Then try Google English voices (some are male)
          voices.find(v => v.lang.includes("en") && v.name.includes("Google") && v.name.toLowerCase().includes("us")) ||
          // Fallback to any English voice
          voices.find(v => v.lang.includes("en")) ||
          voices[0];
      }

      utter.rate   = 0.9;
      utter.pitch  = 1;
      utter.volume = 1;

      utter.onstart  = () => setTalking(true);
      utter.onend    = () => setTalking(false);
      utter.onerror  = () => setTalking(false);

      synth.speak(utter);
    };

    // voices can be loaded asynchronously — wait once if needed
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

  // fire TTS every time the back-end sends a new reply
  useEffect(() => {
    if (response) speak(response);
  }, [response, speak]);

  // Speak greeting on page load
  useEffect(() => {
    const greeting = "Hi! I'm Dave, your virtual customer support assistant. How can I help you with your Aven account today?";
    // Add a small delay to ensure voices are loaded
    const timer = setTimeout(() => {
      speak(greeting);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [speak]);

  // ------------------------------------------------------------

  useEffect(() => {
    if (listening) {
      resetSilenceTimer();
    }
  }, [transcript, listening]);

  useEffect(() => {
    
    return () => clearSilenceTimer();
  }, []);

  const handleMessageSend = async (inputText) => {
    if (!inputText.trim()) return;
    
    // Add user message to conversation history
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
      
      // Add bot response to conversation history
      const botMessage = { type: 'bot', message: botResponse, timestamp: new Date() };
      setConversationHistory(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error("API Error:", error);
      setError(error.response?.data?.message || "Failed to get response from server");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "Account Balance", icon: <AccountBalanceIcon /> },
    { label: "Payment Due Date", icon: <CreditCardIcon /> },
    { label: "Security Settings", icon: <SecurityIcon /> },
    { label: "Fraud Protection", icon: <SecurityIcon /> },
  ];

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
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#1565c0' }}>
        <Toolbar>
          <CreditCardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Aven Customer Support
          </Typography>
          <Button color="inherit" startIcon={<PhoneIcon />}>
            1-800-AVEN-CARD
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                <HelpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Quick Help
              </Typography>
              <Stack spacing={1}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={action.icon}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                    onClick={() => handleMessageSend(`I need help with ${action.label}`)}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </Paper>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">1-800-AVEN-CARD</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">support@aven.com</Typography>
                </Box>
              </CardContent>
            </Card>
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
              

              {/* Status Indicators */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 1 }}>
                {recording && (
                  <Chip 
                    icon={<MicIcon />} 
                    label="Listening..." 
                    color="primary" 
                    variant="filled"
                                         className="pulse-animation"
                  />
                )}
                
              </Box>

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

              {/* Text Input */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {/* Voice Button */}
                {!recording ? (
                  <Button
                    variant="contained"
                    startIcon={<MicIcon />}
                    onClick={startSpeechRecognition}
                    disabled={loading}
                    sx={{ 
                      minWidth: 120,
                      backgroundColor: '#1565c0',
                      '&:hover': { 
                        backgroundColor: '#0d47a1',
                      }
                    }}
                  >
                    Voice
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<MicOffIcon />}
                    onClick={endSpeechRecognition}
                    sx={{ 
                      minWidth: 120,
                      backgroundColor: '#d32f2f',
                      '&:hover': { 
                        backgroundColor: '#b71c1c',
                      }
                    }}
                  >
                    Stop
                  </Button>
                )}
                {loading && (
                  <Chip 
                    icon={<CircularProgress size={16} />} 
                    label="Processing..." 
                    color="info" 
                    variant="filled"
                  />
                )}
                {!loading && <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your question about your Aven account..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleMessageSend(textInput);
                      setTextInput("");
                    }
                  }}
                  disabled={loading || recording}
                  multiline
                  maxRows={3}
                />
                }
                <Button
                  variant="contained"
                  onClick={() => {
                    handleMessageSend(textInput);
                    setTextInput("");
                  }}
                  disabled={loading || recording || !textInput.trim()}
                  sx={{ minWidth: 60 }}
                >
                  <SendIcon />
                </Button>
              </Box>

              {/* Current Conversation */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3, minHeight: 120, backgroundColor: '#fafafa' }}>
                <Typography variant="h6" gutterBottom>
                  Current Conversation
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontStyle: recording ? 'italic' : 'normal',
                    color: recording ? 'primary.main' : 'text.primary',
                    minHeight: 24
                  }}
                >
                  {recording ? `You: ${transcript || 'Say something...'}` : 
                   response ? `Dave: ${response}` : 
                   'Click "Start Voice Chat" or type your question below to begin.'}
                </Typography>
              </Paper>

              

              {/* Conversation History */}
              {conversationHistory.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Conversation History
                  </Typography>
                                     <Box sx={{ maxHeight: 300, overflowY: 'auto' }} className="conversation-history">
                     {conversationHistory.map((item, index) => (
                      <Paper 
                        key={index} 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          mb: 1, 
                          backgroundColor: item.type === 'user' ? '#e3f2fd' : '#f1f8e9' 
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.type === 'user' ? 'You' : 'Dave'} - {item.timestamp.toLocaleTimeString()}
                        </Typography>
                        <Typography variant="body1">
                          {item.message}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
             </Container>
    </Box>
  );
}

export default Speech;