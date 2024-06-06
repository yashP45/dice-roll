import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateToken } from './authMiddleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let points = 5000;

interface User {
  username: string;
  password: string;
}

const users: User[] = [];

app.post('/api/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userExists = users.find(user => user.username === username);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  const token = jwt.sign({ username: username }, process.env.TOKEN_SECRET || 'secretkey', { expiresIn: '1h' });
  res.status(201).json({ message: 'User registered successfully' , token: token });
});

app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user) return res.status(400).json({ message: 'User does not exist' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ username: user.username }, process.env.TOKEN_SECRET || 'secretkey', { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/update-points', authenticateToken, (req: Request, res: Response) => {
  const { bet, option } = req.body;
  const dice1 = Math.floor(Math.random() * 6);
  const dice2 = Math.floor(Math.random() * 6);

  let generatedNumber = dice1 + dice2;

  let result = '';

  if ((generatedNumber > 7 && option === '7 up') ||
      (generatedNumber === 7 && option === '7') ||
      (generatedNumber < 7 && option === '7 down')) {
    points += bet;
    result = 'win';
  } else {
    points -= bet;
    result = 'lose';
  }

  res.json({ points, result, dice1, dice2 });
});
app.post('/api/reset-points', authenticateToken, (req: Request, res: Response) => {
  points = 5000; 
  res.json({ points });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
