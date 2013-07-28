
/**
 * Module dependencies.
 */

var express = require('express')
  , api = require('./routes/api')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gistblog');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../frontend/public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/api/posts', api.posts);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var fetch_posts = require('./fetch_posts');
fetch_posts.update();
setInterval(function() {
  fetch_posts.update();
}, 5 * 60 * 1000 /* 5 mins */);

