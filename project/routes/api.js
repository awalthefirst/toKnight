var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/places', function(req, res, next) {
  res.send("palces is here")
});

module.exports = router;