var express = require('express');
var router = express.Router();
var oauth = require("../helpers/Oauth")
var fs = require("fs");
var jade = require("jade");
var db = require("../model/users");

/* GET home page. */

router.get('/place', function (req, res, next) {

  oauth({
    location: req.query.location,
    limit: 20,
    sort: 2
  }, function (err, ress, body) {
    if (err) {
      res.status(404);
    }

    fs.readFile('./views/fragments/results.jade', 'utf8', function (err, data) {
      if (err) {
        return res.status(404)
      };

      var fn = jade.compile(data);
      var html = fn({
        data: JSON.parse(body).businesses
      });
      res.send(html);
    });

  })

});

router.get('/user', function (req, res) {
  var user = JSON.parse(req.query.data);
  db.findUser(user.id, findUserCb);

  function findUserCb(err, data) {
    if (err) {
      console.log(err);
    }
    else {

      if (data === null) { 
        db.newUser(user, newUserCb)
      }
      else {
        console.log(data);
      }
    }
  }

  function newUserCb(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      // save success
    }
  }

})


module.exports = router;