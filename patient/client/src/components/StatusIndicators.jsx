// patient/client/src/components/StatusIndicators.jsx
import { Box, Chip, CircularProgress } from "@mui/material";
import { Mic as MicIcon } from "@mui/icons-material";

function StatusIndicators({ recording, talking, loading }) {
  return (
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
      {talking && (
        <Chip 
          label="Speaking..." 
          color="success" 
          variant="filled"
        />
      )}
      {loading && (
        <Chip 
          icon={<CircularProgress size={16} />} 
          label="Processing..." 
          color="info" 
          variant="filled"
        />
      )}
    </Box>
  );
}

export default StatusIndicators;
