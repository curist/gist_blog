app.controller('PostCtrl', function ($scope, $http) {
  $http.get('/api/posts')
    .success(function(posts) {
      $scope.posts = posts;
    });
});

