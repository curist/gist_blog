var restler = require('restler');
var _ = require('underscore');

var Post = require('./models/post');

module.exports.update = function() {
  // TODO: support ETag
  restler.json('https://api.github.com/users/curist/gists', {
    headers: {
      Authorization: 'token e4f95b9a510741dae14cbc0b353d3270f913d7b8'
    }
  })
  .on('success', function(gists, resp) {
    var posts = gists.filter(function(gist) {
      return _(Object.keys(gist.files)).contains('blogpost.md');
    }).map(function(gist) {
      return prune(Post, new Post(gist));
    });

    posts.forEach(function(post) {
      Post.update({id: post.id}, post, {upsert: true}, function(err) {
        if(err) {
          console.log(err);
        }
      });
    });
    process.exit(0);
  })
  .on('fail', function(data, resp) {
    console.log('Failed to update gists.');
    process.exit(1);
  })
  .on('error', function(err, resp) {
    console.log('Err when updating gists: ' + err);
    process.exit(2);
  });
};

function prune(model, instance) {
  var keys = Object.keys(model.schema.paths).filter(
    function(s){return s !== '_id' && s !== '__v'}
  );
  var obj = {};
  keys.forEach(function(key) {
    obj[key] = instance[key];
  })
  return obj;
}

