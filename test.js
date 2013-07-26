var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gistblog');

var fetch_posts = require('./fetch_posts');
fetch_posts.update();

setInterval(function() {
  fetch_posts.update();
}, 10000);
