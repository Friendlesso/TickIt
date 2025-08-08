const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  type: String,
  Deadline: String,
  completed: Boolean,
});

module.exports = mongoose.model('Task', taskSchema);