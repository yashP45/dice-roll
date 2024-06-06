import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setToken, setUsername } from '../store/userslice';
import { useAppDispatch } from '../hooks';
const Register: React.FC = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
const navigate = useNavigate()
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     const response = await axios.post("https://dice-roll-6mju.onrender.com/api/register", { username, password });
      dispatch(setToken(response.data.token));
      dispatch(setUsername(username));
      navigate('/bet')
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ mx: 5 , my:5 }}>
      <Typography variant="h4">Register</Typography>
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
      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </Box>
  );
};

export default Register;
