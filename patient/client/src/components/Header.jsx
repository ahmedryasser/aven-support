// patient/client/src/components/Header.jsx
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { CreditCard as CreditCardIcon, Phone as PhoneIcon } from "@mui/icons-material";

function Header() {
  return (
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
  );
}

export default Header;
