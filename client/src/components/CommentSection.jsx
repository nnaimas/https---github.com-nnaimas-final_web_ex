import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function CommentSection({ photoId, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments/${photoId}`);
      setComments(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [photoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post('/comments', {
        photoId: photoId,
        text: comment.trim()
      });

      if (response.data) {
        setComments(prev => [response.data, ...prev]);
        setComment('');
        setError('');
        if (onCommentAdded) {
          onCommentAdded(response.data);
        }
      }
    } catch (error) {
      console.error('Comment error:', error);
      setError(error.response?.data?.error || 'Không thể gửi bình luận');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 2,
        background: "linear-gradient(145deg, #ffffff 0%, #fff8f0 100%)",
        boxShadow: "0 4px 20px rgba(255, 152, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#FF9800",
          fontWeight: 600,
          mb: 2,
        }}
      >
        Bình luận
      </Typography>

      {user ? (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#FF9800",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FF9800",
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<Send />}
            disabled={!comment.trim()}
            sx={{
              bgcolor: "#FF9800",
              "&:hover": {
                bgcolor: "#F57C00",
              },
              "&:disabled": {
                bgcolor: "#FFE0B2",
              },
            }}
          >
            Gửi
          </Button>
        </form>
      ) : (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Vui lòng đăng nhập để bình luận
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <List sx={{ mt: 2 }}>
        {comments.map((comment, index) => (
          <React.Fragment key={comment._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="subtitle2"
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {comment.user.first_name} {comment.user.last_name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {comment.text}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {new Date(comment?.createdAt).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < comments.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default CommentSection; 