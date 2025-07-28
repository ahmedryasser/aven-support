// patient/client/src/components/CurrentConversation.jsx
import { Paper, Typography } from "@mui/material";

function CurrentConversation({ recording, transcript, response }) {
  const getDisplayText = () => {
    if (recording) {
      return `You: ${transcript || 'Say something...'}`;
    }
    if (response) {
      return `Dave: ${response}`;
    }
    return 'Click "Voice" or type your question below to begin.';
  };

  return (
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
        {getDisplayText()}
      </Typography>
    </Paper>
  );
}

export default CurrentConversation;