import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Logout,
  PhotoCamera,
  Person
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, handleLoginStateChange } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/admin/logout');
      handleLoginStateChange(false, null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
        boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)'
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 600,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
          onClick={() => navigate('/')}
        >
          Ứng dụng Chia sẻ Ảnh
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PhotoCamera />}
              onClick={() => navigate(`/photos/${user._id}`)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)'
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Ảnh của tôi
            </Button>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ 
                bgcolor: '#FF5722',
                boxShadow: '0 2px 8px rgba(255, 87, 34, 0.4)'
              }}>
                {user.first_name?.[0]}{user.last_name?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  minWidth: 180
                }
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Đăng nhập với tên
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.first_name} {user.last_name}
                </Typography>
              </Box>
              <Divider />
              <MenuItem 
                onClick={() => { navigate('/profile'); handleClose(); }}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)'
                  }
                }}
              >
                <Person sx={{ mr: 1.5, color: '#666' }} />
                Hồ sơ
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.1)'
                  }
                }}
              >
                <Logout sx={{ mr: 1.5 }} />
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
            sx={{
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Đăng nhập
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 