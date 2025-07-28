// patient/client/src/components/VoiceInput.jsx
import { Box, TextField, Button } from "@mui/material";
import { Mic as MicIcon, MicOff as MicOffIcon, Send as SendIcon } from "@mui/icons-material";

function VoiceInput({ 
  recording, 
  loading, 
  textInput, 
  setTextInput, 
  onStartRecording, 
  onStopRecording, 
  onSendMessage 
}) {
  const handleSendClick = () => {
    onSendMessage(textInput);
    setTextInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
      {/* Voice Button */}
      {!recording ? (
        <Button
          variant="contained"
          startIcon={<MicIcon />}
          onClick={onStartRecording}
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
          onClick={onStopRecording}
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
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your question about your Aven account..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading || recording}
        multiline
        maxRows={3}
      />
      <Button
        variant="contained"
        onClick={handleSendClick}
        disabled={loading || recording || !textInput.trim()}
        sx={{ minWidth: 60 }}
      >
        <SendIcon />
      </Button>
    </Box>
  );
}

export default VoiceInput;