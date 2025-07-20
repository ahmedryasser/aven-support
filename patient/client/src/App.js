import logo from './logo.svg';
import './App.css';
import Speech from './Speech';
import { Stack } from '@mui/material';


function App() {
  return (
    <Stack sx={{width:"100vw", height:"100vh"}} className="App">
      <Speech />
    </Stack>
  );
}

export default App;
