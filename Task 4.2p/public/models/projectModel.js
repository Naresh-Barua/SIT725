const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,
  description: String
});

module.exports = mongoose.model('Project', projectSchema); 