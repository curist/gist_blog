var mongoose = require('mongoose');
var schema = new mongoose.Schema({
  id: String,
  created_at: Date,
  updated_at: Date,
  description: String,
  post_content: {type: String, default: ''},
  comments: [{
    id: String,
    created_at: Date,
    updated_at: Date,
    user: {
      login: String,
      avatar_url: String,
      html_url: String
    },
    body: String
  }]

});

module.exports = mongoose.model('Post', schema);
