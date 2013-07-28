var redis = require('redis');
var redis_client = redis.createClient();
var when = require('when');

var Post = require('../models/post');
exports.posts = function(req, res){
  promise_get('all_posts', Post.find())
    .then(function(result) {
      res.json(result);
    });
};

exports.post_with_id = function(req, res) {
  var post_id = req.params.id;
  var key = 'posts/' + post_id;
  promise_get(key, Post.find({id: post_id}))
    .then(function(result) {
      res.json(result);
    });
};

function promise_get(key, query) {
  var expire_time = 300; // 5 mins
  var deferred = when.defer();
  redis_client.get(key, function(err, result) {
    if(err || !result) {
      query.exec().on('complete', function(query_result) {
        redis_client.setex(
          key,
          expire_time,
          JSON.stringify(query_result)
        );
        deferred.resolve(query_result);
      });
    } else {
      deferred.resolve(JSON.parse(result));
    }
  });
  return deferred.promise;
}
