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
  CircularProgress
} from '@mui/material';
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
      const response = await axios.get(`/photosOfUser/${userId}`);
      setPhotos(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Không thể tải ảnh');
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

  const handleCommentAdded = (photoId, newComment) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo._id === photoId 
          ? { ...photo, comments: [...photo.comments, newComment] }
          : photo
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {user && user._id === userId && (
        <PhotoUpload userId={userId} onUploadSuccess={handleUploadSuccess} />
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
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
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {photo.description || 'Không có chú thích'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  {new Date(photo.date_time).toLocaleString()}
                </Typography>
                
                <CommentSection 
                  photoId={photo._id}
                  comments={photo.comments}
                  onCommentAdded={(newComment) => handleCommentAdded(photo._id, newComment)}
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