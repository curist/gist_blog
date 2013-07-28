app.controller('PostCtrl', function ($scope, $http) {
  $http.get('/api/posts')
    .success(function(posts) {
      posts = posts.map(function(post) {
        post.real_time = moment(post.created_at).format('LLL');

        post.comments = post.comments.map(function(comment) {
          comment.real_time = moment(comment.created_at).format('LLL');
          comment.human_time = moment(comment.created_at).fromNow();
          return comment;
        });

        return post;
      });
      $scope.posts = posts;
    });
});

