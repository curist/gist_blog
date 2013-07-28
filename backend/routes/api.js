var Post = require('../models/post');
exports.posts = function(req, res){
  // TODO: cache result
  var query = Post.find();
  query.exec().on('complete', function(posts) {
    res.json(posts);
  });
};
