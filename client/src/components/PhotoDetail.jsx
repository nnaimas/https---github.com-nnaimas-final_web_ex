import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
  Avatar,
  Grid
} from '@mui/material';
import axios from 'axios';

function PhotoDetail() {
  const { photoId } = useParams();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhotoAndComments = async () => {
      try {
        setLoading(true);
        // Fetch photo details
        const photoResponse = await axios.get(`/photos/${photoId}`);
        setPhoto(photoResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(`/comments/${photoId}`);
        console.log('Comments response:', commentsResponse.data);
        if (commentsResponse.data.success) {
          setComments(commentsResponse.data.data);
        } else {
          console.error('Error in comments response:', commentsResponse.data.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load photo details');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoAndComments();
  }, [photoId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      console.log('Submitting comment for photo:', photoId);
      const response = await axios.post('/comments', {
        comment: newComment.trim(),
        photo_id: photoId
      });

      console.log('Comment response:', response.data);
      if (response.data) {
        // Add new comment to the beginning of the list
        setComments(prevComments => [response.data, ...prevComments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!photo) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Photo not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Photo Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <img
          src={`/images/${photo.file_name}`}
          alt="Photo"
          style={{ 
            width: '100%', 
            maxHeight: '600px', 
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar>
                {photo.user_id.first_name[0]}{photo.user_id.last_name[0]}
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                {photo.user_id.first_name} {photo.user_id.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(photo.date_time).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Comments Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments ({comments.length})
        </Typography>

        {/* Comment Form */}
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim()}
            sx={{ minWidth: '120px' }}
          >
            Post Comment
          </Button>
        </Box>

        {/* Comments List */}
        <List>
          {comments.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            comments.map((comment) => (
              <React.Fragment key={comment._id}>
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Avatar>
                        {comment.user.first_name[0]}{comment.user.last_name[0]}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" component="span">
                            {comment.user.first_name} {comment.user.last_name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body1"
                              color="text.primary"
                              sx={{ display: 'block', my: 1 }}
                            >
                              {comment.text}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default PhotoDetail; 