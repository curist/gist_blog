var mongoose = require('mongoose');
var schema = new mongoose.Schema({
  id: String,
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Post', schema);
