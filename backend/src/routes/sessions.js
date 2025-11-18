const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const router = express.Router();
const { nanoid } = require('nanoid');

// Create session (host)
router.post('/create', auth, async (req,res)=>{
  try{
    const { questionIds } = req.body;
    const code = nanoid(6).toUpperCase();
    const startedAt = new Date();
    const endedAt = new Date(startedAt.getTime() + 20*60*1000); // 20 minutes
    const s = await Session.create({ code, hostId: req.user._id, questions: questionIds, startedAt, endedAt, active:true });
    res.json(s);
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

// Join session by code
router.post('/join', auth, async (req,res)=>{
  try{
    const { code } = req.body;
    const s = await Session.findOne({code}).populate('questions');
    if(!s) return res.status(404).json({error:'session not found'});
    const now = new Date();
    if(now < s.startedAt || now > s.endedAt || !s.active) return res.status(400).json({error:'session closed'});
    if(!s.participants.includes(req.user._id)) s.participants.push(req.user._id);
    await s.save();
    res.json({sessionId: s._id, questions: s.questions.map(q=> ({ id: q._id, text: q.text, options: q.options }))});
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

// Submit answer
router.post('/:sessionId/answer', auth, async (req,res)=>{
  try{
    const { sessionId } = req.params;
    const { questionId, choiceIndex } = req.body;
    const s = await Session.findById(sessionId).populate('questions');
    if(!s) return res.status(404).json({error:'no session'});
    const now = new Date();
    if(now < s.startedAt || now > s.endedAt || !s.active) return res.status(400).json({error:'session closed'});
    const q = s.questions.find(q=> q._id.toString() === questionId);
    if(!q) return res.status(400).json({error:'question not found'});
    const correct = (q.correctIndex === choiceIndex);
    const existing = s.answers.find(a => a.userId.toString() === req.user._id.toString() && a.questionId.toString() === questionId);
    if(existing){ existing.choiceIndex = choiceIndex; existing.correct = correct; existing.answeredAt = now; }
    else s.answers.push({ userId: req.user._id, questionId, choiceIndex, correct, answeredAt: now });
    await s.save();
    res.json({ok:true, correct});
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

// Rankings for session
router.get('/:sessionId/rank', auth, async (req,res)=>{
  try{
    const s = await Session.findById(req.params.sessionId).populate('answers.userId').populate('answers.questionId');
    if(!s) return res.status(404).json({});
    const scores = {};
    s.answers.forEach(a=>{
      const uid = a.userId._id.toString();
      if(!scores[uid]) scores[uid] = { user: a.userId, correct:0, answered:0 };
      if(a.correct) scores[uid].correct += 1;
      scores[uid].answered += 1;
    });
    const ranking = Object.values(scores).sort((a,b)=> b.correct - a.correct);
    res.json(ranking);
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

module.exports = router;
