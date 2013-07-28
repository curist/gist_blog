app = angular.module('GistBlog', []);

app.config(function($routeProvider) {
  $routeProvider
    .when('/posts/:post_id', {
      templateUrl: 'partials/post_detail.html',
      controller: 'PostDetailCtrl'})
    .when('/posts', {
      templateUrl: 'partials/posts.html',
      controller: 'PostsCtrl'})
    .otherwise({redirectTo: '/posts' });
});
