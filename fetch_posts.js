var restler = require('restler');
var AUTH = require('./auth_token');
var _ = require('underscore');
var when = require('when');

var Post = require('./models/post');

module.exports.update = function() {
  // TODO: support ETag
  restler.json('https://api.github.com/users/curist/gists', AUTH)
  .on('success', function(gists, resp) {
    var gists = gists.filter(function(gist) {
      return _(Object.keys(gist.files)).contains('blogpost.md');
    });

    gists.forEach(function(gist) {
      when.all([promise_get_post(gist), promise_get_comments(gist)])
        .then(function(values) {
          gist.post_content = values[0];
          gist.comments = values[1];

          var post = prune(new Post(gist));
          // console.log(post);
          Post.update({id: post.id}, post, {upsert: true}, function(err) {
            if(err) {
              console.log(err);
            }
          });
          process.exit(0);
        });
    });
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

function promise_get_post(gist) {
  var post_url = gist.files['blogpost.md'].raw_url;
  var deferred = when.defer();
  restler.get(post_url, AUTH)
  .on('success', function(body, resp) {
    deferred.resolve(body);
  })
  .on('error', function(err, resp) {
    deferred.reject(err);
  });
  return deferred.promise;
}

function promise_get_comments(gist) {
  var comments_url = gist.comments_url;
  var deferred = when.defer();
  restler.json(comments_url, AUTH)
  .on('success', function(comments, resp) {
    deferred.resolve(comments);
  })
  .on('error', function(err, resp) {
    deferred.reject(err);
  });
  return deferred.promise;

}

function prune(instance) {
  var obj = instance.toObject();
  delete obj._id;
  return obj;
}

