// patient/client/src/components/Sidebar.jsx
import { Paper, Typography, Stack, Button, Card, CardContent, Box } from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from "@mui/icons-material";

function Sidebar({ onQuickAction }) {
  const quickActions = [
    { label: "Account Balance", icon: <AccountBalanceIcon /> },
    { label: "Payment Due Date", icon: <CreditCardIcon /> },
    { label: "Security Settings", icon: <SecurityIcon /> },
    { label: "Fraud Protection", icon: <SecurityIcon /> },
  ];

  return (
    <>
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
              onClick={() => onQuickAction(`I need help with ${action.label}`)}
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
    </>
  );
}

export default Sidebar;
