var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var userSchema = new Schema({
  fbId: {
    type: String,
    unique: true,
    required: true
  },
  fbEmail: {
    type: String,
    unique: true,
    required: true
  },
});

var obj = {
  User: mongoose.model('registry', userSchema),
  newUser: newUser,
  findUser: findUser
}


function findUser(query, cb) {
  obj.User.findOne({
    fbId: query
  }, cb);
}


function newUser(query, cb) {

  var user = new obj.User({
    fbId: query.id,
    fbEmail: query.email
  })
  user.save(cb);

}


var dbuser = process.env.dbUser;
var dbpassword = process.env.dbPass;
//mongo
mongoose.connect('mongodb://' + dbuser + ':' + dbpassword + '@ds045454.mongolab.com:45454/toknight');

module.exports = obj;
