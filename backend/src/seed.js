require('dotenv').config();
const connect = require('./config/db');
const Question = require('./models/Question');

async function run(){
  await connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizdb');
  await Question.deleteMany({});
  const q = [
    { text: 'What is 2+2?', options: ['1','2','3','4'], correctIndex: 3 },
    { text: 'Capital of France?', options: ['Berlin','Madrid','Paris','Rome'], correctIndex: 2 },
    { text: 'Which is a JS runtime?', options: ['Node','React','Vue','Angular'], correctIndex: 0 },
    { text: 'HTML stands for?', options: ['Hyperlinks','Hypertext Markup Language','Home Tool','None'], correctIndex: 1 }
  ];
  await Question.insertMany(q);
  console.log('seeded'); process.exit(0);
}
run();
