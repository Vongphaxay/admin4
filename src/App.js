import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  CssBaseline, 
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Grid,
  Divider
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './admin/dashboard';
import BookingTable from './admin/databooking';
import EmployeeManagement from './admin/dataemployee';
import CustomerManagement from './admin/datacustomer';
import PetBoarding from './admin/petboard';
import BathPet from './admin/bathpet';
import { Person, Lock, Visibility, VisibilityOff, Login as LoginIcon, Pets } from '@mui/icons-material';


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(147, 88, 247, 0.2) 0%, rgba(16, 215, 177, 0.2) 100%)',
        }}
      />

      <CssBaseline />
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={16}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '20px',
              boxShadow: '0 10px 50px rgba(0, 0, 0, 0.12)',
              background: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Header color accent */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'linear-gradient(90deg, #5c2c1d 0%, #753b2a 100%)',
              }}
            />

            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              width="100%"
              mb={4}
            >
              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #5c2c1d, #753b2a)',
                  color: 'white',
                  mb: 2,
                  boxShadow: '0 6px 20px rgba(92, 44, 29, 0.3)',
                }}
              >
                <Pets sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#5c2c1d', mb: 0.5 }}>
                DR. P VETERINARY
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
                ຍິນດີຕ້ອນຮັບ, ກະລຸນາເຂົ້າສູ່ລະບົບ
              </Typography>
              <Divider sx={{ width: '40%', my: 2 }} />
            </Box>

            {error && 
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%', 
                    marginBottom: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            }

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="ຊື່ຜູ້ໃຊ້"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#5c2c1d' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#ddd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#5c2c1d',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5c2c1d',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ລະຫັດຜ່ານ"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#5c2c1d' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#ddd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#5c2c1d',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5c2c1d',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleLogin}
                  disabled={loading}
                  startIcon={<LoginIcon />}
                  sx={{
                    marginTop: 1,
                    padding: '12px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #5c2c1d, #753b2a)',
                    boxShadow: '0 6px 15px rgba(92, 44, 29, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(145deg, #6e3423, #83422f)',
                      boxShadow: '0 8px 20px rgba(92, 44, 29, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ'}
                </Button>
              </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="center" width="100%">
              <Typography variant="body2" color="textSecondary">
                © 2025 DR. P VETERINARY CLINIC. ສະຫງວນລິຂະສິດ.
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/databooking" element={<BookingTable />} />
        <Route path="/dataemployee" element={<EmployeeManagement />} />
        <Route path="/datacustomer" element={<CustomerManagement />} />
        <Route path="/petboarding" element={<PetBoarding />} />
        <Route path="/bathpet" element={<BathPet />} />
      </Routes>
    </Router>
  );
};

export default App;