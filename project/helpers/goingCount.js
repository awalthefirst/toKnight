 var goingDb = require("../model/going");
 var obj = {
   init: yelpIdArr,
   getCount: getCount,
   getRes: getRes
 };

 //get yelp bussiness Id
 function yelpIdArr(body) {
   var obj = body;
   var Arr = [];
   for (var key in obj) {
     Arr.push(obj[key].id);
   }
   return Arr;
 }
 //get number of people going
 function getCount(Arr, req, cb) {

   //find users counts 
   goingDb.Going.find({
     fbId: req.fbLogin.id,
     yelpId: {
       $in: Arr
     }
   }, function (err, data1) {
     if (err) {
       return cb(err);
     }
      
      var obj1 = [];
       data1.forEach(function (val) {
          obj1.push(val.yelpId);
       });

     // find other people count
     goingDb.Going.aggregate({
       "$match": {
         'yelpId': {
           "$in": Arr
         }
       }
     }, {
       "$group": {
         _id: "$yelpId",
         "total": {
           "$sum": 1
         }
       }
     }, function (err, data2) {
       if (err) {
         return cb(err);
       }
        
       var obj2 = {};
       data2.forEach(function (val) {
       obj2[val._id] = val.total
       });
            
            // return the vals
         cb(err, obj1, obj2);
     });


   });
 }
 
 function getRes(body,data,cb) {
    console.log(data.userGoing)
   body.forEach(function(ele,index){
      
      body[index].going = data.peopleGoing[body[index].id] || 0;
      
     if(data.userGoing.indexOf(body[index].id) > -1){
      body[index].userMade = true;
     }else{
        body[index].userMade = false; 
     }
   })
   
   cb(null,body);
 }

 module.exports = obj;

