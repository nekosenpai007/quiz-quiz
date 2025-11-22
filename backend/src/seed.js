require('dotenv').config();
const connect = require('./config/db');
const Question = require('./models/Question');
const Session = require('./models/Session');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function run(){
  try {
    await connect(process.env.MONGO_URI || 'mongodb://mongo:27017/quizdb');
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Question.deleteMany({});
    await Session.deleteMany({});
    console.log('Cleared existing data');
    
    // Create or find host user
    let host = await User.findOne({email: 'host@quiz.com'});
    if (!host) {
      const passwordHash = await bcrypt.hash('host123', 10);
      host = await User.create({
        name: 'Quiz Host',
        email: 'host@quiz.com',
        passwordHash: passwordHash,
        role: 'host'
      });
      console.log('Created host user');
    }

    // Create questions
    const questions = await Question.insertMany([
      { 
        text: "What is 2+2?", 
        options: ["3", "2", "5", "4"], 
        correctIndex: 3 
      },
      { 
        text: "What is 1+1?", 
        options: ["1", "3", "2", "0"], 
        correctIndex: 2 
      }
    ]);
    console.log('Created questions:', questions.length);

    // Create a session with all questions
    await Session.create({
      sessionCode: 'QUIZ123',
      title: 'Math Quiz Session',
      host: host._id,
      questions: questions.map(q => q._id),
      isActive: true
    });
    console.log('Created session: QUIZ123');

    console.log('✅ Seeded successfully!');
    console.log('👤 Host Login: host@quiz.com / host123');
    
  } catch (error) {
    console.error('Seed error:', error);
  }
  process.exit(0);
}

run();