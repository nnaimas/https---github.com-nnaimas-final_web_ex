import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';

function PhotoUpload({ userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Vui lòng chọn file ảnh');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('description', description);

      const response = await axios.post(`/photos/new`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setFile(null);
        setDescription('');
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Lỗi khi upload ảnh');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff 0%, #fff8f0 100%)',
        boxShadow: '0 4px 20px rgba(255, 152, 0, 0.1)'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: '#FF9800',
          fontWeight: 600,
          mb: 2
        }}
      >
        Upload Ảnh Mới
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{
                mb: 2,
                borderColor: '#FF9800',
                color: '#FF9800',
                '&:hover': {
                  borderColor: '#F57C00',
                  backgroundColor: 'rgba(255, 152, 0, 0.04)'
                }
              }}
            >
              Chọn Ảnh
            </Button>
          </label>
          {file && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Đã chọn: {file.name}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          label="Chú thích"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !file}
          sx={{
            bgcolor: '#FF9800',
            '&:hover': {
              bgcolor: '#F57C00'
            },
            '&:disabled': {
              bgcolor: '#FFE0B2'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload Ảnh'}
        </Button>
      </form>
    </Paper>
  );
}

export default PhotoUpload; 