require('dotenv').config();
const express = require('express');
const app = express();
const connect = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const sessionRoutes = require('./routes/sessions');

connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizdb');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 4000; // Change from 5000 to 4000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
