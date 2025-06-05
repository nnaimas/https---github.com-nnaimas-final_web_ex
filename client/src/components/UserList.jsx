import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Paper,
  Box,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get("/photos");
        setPhotos(response.data);
      } catch (error) {
        console.error("loi tai du lieu: ", error);
        setError("Khong the tai danh sach anh");
      } finally {
        setLoading(false);
      }
    };
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/user/list");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        borderRadius: 2,
        background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Danh sách người dùng
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {users.map((user) => (
          <ListItem key={user._id} disablePadding>
            <ListItemButton
              onClick={() => navigate(`/user/${user._id}`)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  "& .MuiListItemText-primary": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                <PersonIcon />
              </Avatar>
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
                primaryTypographyProps={{
                  sx: { fontWeight: 500 },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default UserList;