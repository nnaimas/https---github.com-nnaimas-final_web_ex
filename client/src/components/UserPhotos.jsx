import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import PhotoUpload from './PhotoUpload';
import CommentSection from './CommentSection';

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`/photos/user/${userId}`);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setPhotos(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError(error.response?.data?.error || 'Không thể tải ảnh. Vui lòng thử lại sau.');
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const handleUploadSuccess = (newPhoto) => {
    setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
  };

  const handleCommentAdded = (newComment) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo._id === newComment.photo_id 
          ? { 
              ...photo, 
              comments: [newComment, ...(photo.comments || [])]
            }
          : photo
      )
    );
  };

  const handleLike = async (photoId) => {
    try {
      await axios.post(`/likes/${photoId}`);
      fetchPhotos(); // Refresh photos to get updated like count
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, p: 3, bgcolor: 'error.light', borderRadius: 2 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, p: 3, bgcolor: 'info.light', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Chưa có ảnh nào được đăng
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {user && user._id === userId && (
        <PhotoUpload userId={userId} onUploadSuccess={handleUploadSuccess} />
      )}

      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} key={photo._id}>
            <Card 
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                mb: 3
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={`http://localhost:3000/images/${photo.file_name}`}
                alt={photo.description || 'Ảnh người dùng'}
                sx={{
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  console.error('Error loading image:', photo.file_name);
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
              <CardContent>
                <Button
                  variant="contained"
                  startIcon={<Favorite />}
                  onClick={() => handleLike(photo._id)}
                  sx={{
                    bgcolor: '#ff4081',
                    '&:hover': {
                      bgcolor: '#f50057'
                    },
                    mb: 2
                  }}
                >
                  Thích ({photo.likes?.length || 0})
                </Button>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {photo.description || 'Không có chú thích'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  {new Date(photo.date_time).toLocaleString()}
                </Typography>
                
                <CommentSection 
                  photoId={photo._id}
                  comments={photo.comments}
                  onCommentAdded={(newComment) => handleCommentAdded(newComment)}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default UserPhotos; 