const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req,res)=>{
  try{
    const { name, email, password, role } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error:'Email already exists'});
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user with passwordHash field (matches your model)
    const u = await User.create({
      name,
      email,
      passwordHash,  // This matches your User model
      role: role || 'student'  // Default to student if not provided
    });
    
    const token = jwt.sign({id:u._id}, process.env.JWT_SECRET || 'fallback_secret');
    
    res.json({
      token, 
      user: {
        id:u._id, 
        name:u.name, 
        email:u.email, 
        role:u.role
      }
    });
    
  }catch(err){ 
    console.error('Registration error:', err); 
    res.status(500).json({error:'Server error during registration'}); 
  }
});

router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const u = await User.findOne({email});
    if(!u) return res.status(400).json({error:'Invalid email or password'});
    
    // Compare with passwordHash field (matches your model)
    const ok = await bcrypt.compare(password, u.passwordHash);
    if(!ok) return res.status(400).json({error:'Invalid email or password'});
    
    const token = jwt.sign({id:u._id}, process.env.JWT_SECRET || 'fallback_secret');
    
    res.json({
      token, 
      user: {
        id:u._id, 
        name:u.name, 
        email:u.email, 
        role:u.role
      }
    });
    
  }catch(err){ 
    console.error('Login error:', err); 
    res.status(500).json({error:'Server error during login'}); 
  }
});

module.exports = router;