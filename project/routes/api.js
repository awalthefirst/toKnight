var express = require('express');
var router = express.Router();
var oauth = require("../helpers/Oauth")
var fs = require("fs");
var jade = require("jade");
var userDb = require("../model/users");
var goingDb = require("../model/going")
var goingCount = require("../helpers/goingCount")

router.get('/place', function (req, res, next) {
  
  if (req.query.location === null || req.query.location === undefined || req.query.location.length < 1) {
    return next();
  }
  else {

    oauth({
      location: req.query.location,
      limit: 20,
      sort: 2
    }, function (err, ress, body) {
      if (err) {
        return next();
      }

      var bodyParsed = JSON.parse(body).businesses
        //get yelp bussiness Id
      var yelpBusId = goingCount.init(bodyParsed);
      goingCount.getCount(yelpBusId, req, getCountCb);

      function getCountCb(err, userGoing, peopleGoing) {
        if (err) {

        }
        else {
          var obj = {
            userGoing: userGoing,
            peopleGoing: peopleGoing
          }
          goingCount.getRes(bodyParsed, obj, getResCb);
        }
      }

      function getResCb(err, body) {
        if (err) {
          next();
        }
        else {

          fs.readFile('./views/fragments/results.jade', 'utf8', function (err, data) {
            if (err) {
              next();
            };

            var fn = jade.compile(data);
            var html = fn({
              data: body || bodyParsed,
            });
            res.send(html);
          });

        }
      }


    });

  }
});


router.get('/user/login', function (req, res, next) {
  var user = JSON.parse(req.query.data);
  userDb.findUser(user.id, findUserCb);

  function findUserCb(err, data) {
    if (err) {
      response(err);
    }
    else {
      if (data === null) {
        // new user save them
        userDb.newUser(user, newUserCb)
      }
      else {
        // we have user in userDb
        response(null, data);
      }
    }
  }

  function newUserCb(err, data) {
    if (err) {
      response(err);
    }
    else {
      // save success
      response(null, data);
    }
  }

  function response(err, data) {
    if (err) {
      next();
    }
    else {
      req.fbLogin.id = data.id;
      res.end();
    }
  }

});

router.get('/user/logout', function (req, res, next) {
  req.fbLogin.reset();
  res.redirect('/');

});

router.get("/going/update", function (req, res, next) {
  var goingData = {
    yelpId: req.query.id,
    fbId: req.fbLogin.id
  }

  if (!req.login) {
    next();
  }
  else {
    goingDb.findGoing(goingData, findGoingCb)

    function findGoingCb(err, data) {
      if (err) {
        next();
      }
      else {
        if (data === null) {
          // new going save it
          goingDb.addGoing(goingData, addGoingCb);
        }
        else {
          // duplicate going delete
          goingDb.removeGoing(goingData, removeGoingCb);
        }
      }

      function addGoingCb(err, data) {
        if (err) {
          next();
        }
        else {
          res.end("I'm Out");
        }
      }

      function removeGoingCb(err) {
        if (err) {
          next();
        }
        else {
          res.end('Add me');
        }
      }



    }

  }



});


module.exports = router;