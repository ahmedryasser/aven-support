// patient/client/src/components/ConversationHistory.jsx
import { Box, Divider, Typography, Paper } from "@mui/material";

function ConversationHistory({ conversationHistory }) {
  if (conversationHistory.length === 0) {
    return null;
  }

  return (
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
  );
}

export default ConversationHistory;


