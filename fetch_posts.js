var restler = require('restler');
var AUTH = require('./auth_token');
var _ = require('underscore');
var when = require('when');
var marked = require('marked');

var Post = require('./models/post');

module.exports.update = function() {
  // TODO: support ETag
  console.log('Updating posts...');
  restler.get('https://api.github.com/users/curist/gists', AUTH)
    .on('success', function(gists, resp) {
      var gists = gists.filter(function(gist) {
        return _(Object.keys(gist.files)).contains('blogpost.md');
      });

      when.all(gists.map(function(gist) {
        return when.all([promise_get_post(gist), promise_get_comments(gist)])
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
          });
      }))
        .then(function() {
          console.log('Posts updated.');
        });
    })
    .on('fail', function(data, resp) {
      console.log(data);
      console.log('Failed to update gists.');
    })
    .on('error', function(err, resp) {
      console.log('Err when updating gists: ' + err);
    });
};

function promise_get_post(gist) {
  var post_url = gist.files['blogpost.md'].raw_url;
  var deferred = when.defer();
  restler.get(post_url, AUTH)
    .on('success', function(body, resp) {
      deferred.resolve(marked(body));
    })
    .on('error', function(err, resp) {
      deferred.reject(err);
    });
  return deferred.promise;
}

function promise_get_comments(gist) {
  var comments_url = gist.comments_url;
  var deferred = when.defer();
  restler.get(comments_url, AUTH)
    .on('success', function(comments, resp) {
      comments = comments.map(function(orig_comment) {
        var comment = orig_comment;
        comment.body = marked(orig_comment.body);
        return comment;
      });
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

