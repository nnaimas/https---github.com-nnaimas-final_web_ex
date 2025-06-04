import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  Avatar
} from '@mui/material';
import { PhotoCamera, Login as LoginIcon } from '@mui/icons-material';
import axios from 'axios';

function LoginRegister({ onLoginStateChange }) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    login_name: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = activeTab === 0 ? '/admin/login' : '/admin/register';
      const response = await axios.post(endpoint, formData);
      
      console.log('Login/Register response:', response.data);
      
      if (response.data && response.data._id) {
        // Format user data
        const userData = {
          _id: response.data._id,
          login_name: response.data.login_name,
          first_name: response.data.first_name,
          last_name: response.data.last_name
        };
        
        // Update auth state
        if (onLoginStateChange) {
          onLoginStateChange(true, userData);
        }

        // Navigate to home page
        navigate('/');
      } else {
        setError('Đăng nhập không thành công');
      }
    } catch (error) {
      console.error('Login/Register error:', error);
      setError(error.response?.data?.error || 'Đã xảy ra lỗi');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #fff8f0 100%)',
          boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ 
            bgcolor: '#FF9800', 
            width: 56, 
            height: 56,
            mb: 2,
            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
          }}>
            <PhotoCamera />
          </Avatar>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontWeight: 600,
              color: '#FF9800',
              textShadow: '1px 1px 2px rgba(255, 152, 0, 0.2)'
            }}
          >
            {activeTab === 0 ? 'Đăng Nhập' : 'Đăng Ký'}
          </Typography>
        </Box>

        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: '#FF9800'
          }
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 120,
                color: '#666',
                '&.Mui-selected': {
                  color: '#FF9800'
                }
              }
            }}
          >
            <Tab label="Đăng Nhập" />
            <Tab label="Đăng Ký" />
          </Tabs>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              name="login_name"
              value={formData.login_name}
              onChange={handleInputChange}
              required
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF9800'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF9800'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF9800'
                }
              }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#FF9800'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF9800'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FF9800'
                }
              }}
            />
            {activeTab === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Tên"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#FF9800'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF9800'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FF9800'
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Họ"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#FF9800'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF9800'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#FF9800'
                    }
                  }}
                />
              </>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 2,
              bgcolor: '#FF9800',
              '&:hover': {
                bgcolor: '#F57C00'
              },
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
          >
            {activeTab === 0 ? 'Đăng Nhập' : 'Đăng Ký'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginRegister; 