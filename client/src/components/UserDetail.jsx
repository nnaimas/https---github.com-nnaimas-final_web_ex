import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  LocationOn,
  Work,
  Description,
  PhotoCamera
} from '@mui/icons-material';
import axios from 'axios';

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error || 'Không tìm thấy người dùng'}</Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            sx={{
              width: 150,
              height: 150,
              bgcolor: 'primary.main',
              fontSize: '3rem'
            }}
          >
            {user.first_name[0]}{user.last_name[0]}
          </Avatar>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {user.first_name} {user.last_name}
          </Typography>
          
          {user.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {user.location}
              </Typography>
            </Box>
          )}

          {user.occupation && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Work sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {user.occupation}
              </Typography>
            </Box>
          )}

          {user.description && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Description sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" color="text.secondary">
                  Giới thiệu
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {user.description}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            color="primary"
            startIcon={<PhotoCamera />}
            onClick={() => navigate(`/photos/${userId}`)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Xem ảnh của {user.first_name}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserDetail; 