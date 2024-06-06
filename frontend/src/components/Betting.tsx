import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../hooks';
import { updatePoints, resetPoints } from '../store/pointslice';
import { logout } from '../store/userslice';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Betting: React.FC = () => {
  const token = useAppSelector((state) => state.user.token);
  const points = useAppSelector((state) => state.points.points);
  const username = useAppSelector((state) => state.user.username);
  const dispatch = useAppDispatch();
  const history = useNavigate();

  const [bet, setBet] = useState(0);
  const [option, setOption] = useState('7 up');
  const [result, setResult] = useState<string | null>(null);
  const [dice1, setDice1] = useState<number>(1);
  const [dice2, setDice2] = useState<number>(1);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (rolling) {
      const interval = setInterval(() => {
        setDice1(Math.floor(Math.random() * 6) + 1);
        setDice2(Math.floor(Math.random() * 6) + 1);
      }, 100);
      setTimeout(() => clearInterval(interval), 1000);
      return () => clearInterval(interval);
    }
  }, [rolling]);

  const handleBet = async () => {
    setRolling(true);
    try {
      const response = await axios.post(
        'https://dice-roll-6mju.onrender.com/api/update-points',
        { bet, option },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimeout(() => {
        dispatch(updatePoints(response.data.points));
        setResult(response.data.result);
        setDice1(response.data.dice1 + 1);
        setDice2(response.data.dice2 + 1);
        setRolling(false);
      }, 1000);
    } catch (error) {
      alert('Betting failed');
      setRolling(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    history('/');
  };

  const handleReset = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/reset-points',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(resetPoints());
      dispatch(updatePoints(response.data.points));
      setResult(null);
      setDice1(1);
      setDice2(1);
      setBet(0);
      setOption('7 up');
    } catch (error) {
      alert('Reset failed');
    }
  };

  return (
    <Box  sx={{  backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiEAVRC2gqEJKSCYXbG0Uz42wfWMOTPXY1hA&s)"}}>
    <Box sx={{ px: 5 , py: 5}}>
      <Typography variant="h6">Welcome, {username}</Typography>
      <Typography variant="h6" sx={{textAlign: 'center' , mt: 5 , fontWeight: "bold"}}>Points: {points}</Typography>
      <Typography  sx={{mt: 5 , mb:3}}>Select Bet Amount</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, width: '50vw' }}>
       
        <Button
          variant="contained"
          color={bet === 100 ? 'secondary' : 'primary'}
          onClick={() => setBet(100)}
          sx={{ mx: 1 }}
        >
          100
        </Button>
        <Button
          variant="contained"
          color={bet === 200 ? 'secondary' : 'primary'}
          onClick={() => setBet(200)}
          sx={{ mx: 1 }}
        >
          200
        </Button>
        <Button
          variant="contained"
          color={bet === 500 ? 'secondary' : 'primary'}
          onClick={() => setBet(500)}
          sx={{ mx: 1 }}
        >
          500
        </Button>
      </Box>
      <Typography sx={{mt: 5 , mb:3}}>Select Option</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 5 }}>
     
        <Button
          variant="contained"
          color={option === '7 up' ? 'secondary' : 'primary'}
          onClick={() => setOption('7 up')}
          sx={{ mx: 1 }}
        >
          7 up
        </Button>
        <Button
          variant="contained"
          color={option === '7' ? 'secondary' : 'primary'}
          onClick={() => setOption('7')}
          sx={{ mx: 1 }}
        >
          7
        </Button>
        <Button
          variant="contained"
          color={option === '7 down' ? 'secondary' : 'primary'}
          onClick={() => setOption('7 down')}
          sx={{ mx: 1 }}
        >
          7 down
        </Button>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleBet}
        sx={{ mt: 5, display: 'block', margin: '0 auto' }}
        disabled={rolling}
      >
        Place Bet
      </Button>
      <Box className="dice-container" sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Box className={`dice face-${dice1} ${rolling ? 'rolling' : ''}`}>
          {[...Array(dice1)].map((_, i) => <Box key={i} className="dot"></Box>)}
        </Box>
        <Box className={`dice face-${dice2} ${rolling ? 'rolling' : ''}`}>
          {[...Array(dice2)].map((_, i) => <Box key={i} className="dot"></Box>)}
        </Box>
      </Box>
      {result && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h5">Result: {result}</Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 3 }}
        >
          Logout
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReset}
          sx={{ mt: 3 }}
        >
          Reset
        </Button>
      </Box>
    </Box>
    </Box>
  );
};

export default Betting;
