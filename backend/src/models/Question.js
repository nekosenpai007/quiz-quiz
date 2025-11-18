const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  text: String,
  options: [String], // length 4
  correctIndex: Number
});
module.exports = mongoose.model('Question', questionSchema);
