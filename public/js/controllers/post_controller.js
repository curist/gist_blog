app.controller('PostCtrl', function ($scope, $http) {
  $http.get('http://localhost:3000/api/posts')
    .success(function(posts) {
      $scope.posts = posts;
    });
});

