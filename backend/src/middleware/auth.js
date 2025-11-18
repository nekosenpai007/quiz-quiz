const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({error: 'no token'});
  const token = header.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-passwordHash');
    next();
  }catch(err){
    return res.status(401).json({error:'invalid token'});
  }
};
