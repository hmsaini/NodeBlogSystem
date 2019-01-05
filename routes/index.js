var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/*  home page Blog Posts  */
router.get('/', function (req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, function (err, posts) {   // {},{} find everything
    res.render('index', {
      "posts": posts,                     // display all posts
    });
  });
});

module.exports = router;