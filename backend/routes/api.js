var redis = require('redis');
var redis_client = redis.createClient();

var Post = require('../models/post');
exports.posts = function(req, res){
  redis_client.get('all_posts', function(err, result) {
    if(err || !result) {
      var query = Post.find();
      query.exec().on('complete', function(posts) {
        res.json(posts);
        redis_client.setex(
          'all_posts',
          5 * 60, // 5 mins
          JSON.stringify(posts)
        );
      });
    } else {
      res.json(JSON.parse(result));
    }
  });
};
