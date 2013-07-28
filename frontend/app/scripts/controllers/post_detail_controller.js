app.controller('PostDetailCtrl', function ($scope, $http, $routeParams) {
  var post_id = $routeParams.post_id;

  $http.get('/api/posts/' + post_id)
    .success(function(post) {
      post = post[0];
      post.real_time = moment(post.created_at).format('LLL');

      post.comments = post.comments.map(function(comment) {
        comment.real_time = moment(comment.created_at).format('LLL');
        comment.human_time = moment(comment.created_at).fromNow();
        return comment;
      });

      $scope.post = post;
    });
});

