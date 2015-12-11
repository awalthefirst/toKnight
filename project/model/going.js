var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var goingSchema = new Schema({
  fbId: {
    type: String,
    required: true
  },
  yelpId: {
    type: String,
    required: true
  },
});

function addGoing(query, cb){
  var going = new obj.Going({
    fbId: query.fbId,
    yelpId: query.yelpId
  });
  going.save(cb); 
}

function findGoing(query, cb){
   obj.Going.findOne({
    fbId: query.fbId,
    yelpId:query.yelpId
  }, cb);
}

function removeGoing(query, cb){
  obj.Going.findOneAndRemove({
    fbId: query.fbId,
    yelpId:query.yelpId
  }, cb);
}


var obj = {
  Going: mongoose.model('going', goingSchema),
  findGoing:findGoing,
  addGoing: addGoing,
  removeGoing:removeGoing
};



module.exports = obj;