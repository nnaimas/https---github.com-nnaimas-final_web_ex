import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext.jsx';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AppRoutes />
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;