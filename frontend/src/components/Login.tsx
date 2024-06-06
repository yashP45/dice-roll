import React, { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { setToken, setUsername } from '../store/userslice';
import axios from 'axios';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
const navigate = useNavigate()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      dispatch(setToken(response.data.token));
      dispatch(setUsername(username));
     navigate("/bet")
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ mx: 5  , my:5}}>
      <Typography variant="h4">Login</Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setusername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Login
      </Button>
      <Typography> or Register as new user</Typography><Link href="/register">Click here</Link>
    </Box>
  );
};

export default Login;
