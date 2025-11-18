const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req,res)=>{
  const qs = await Question.find();
  res.json(qs);
});

router.post('/', auth, async (req,res)=>{
  try{
    const { text, options, correctIndex } = req.body;
    if(!text || !options || options.length !==4) return res.status(400).json({error:'bad question'})
    const q = await Question.create({text,options,correctIndex});
    res.json(q);
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

module.exports = router;
