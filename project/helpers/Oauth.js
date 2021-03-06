var dotEnv = require('dotenv').config({silent: true});
var oauthSignature = require('oauth-signature');
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

/* Function for yelp call
 * ------------------------
 * set_param: object with params to search
 * callback: callback(error, response, body)
 */
var request_yelp = function(set_param, callback){


  var httpMethod = 'GET';
  var url = 'http://api.yelp.com/v2/search';
   
  /* We set the require parameters here */
  var required_parameters = {
    oauth_consumer_key : process.env.oauth_consumer_key,
    oauth_token : process.env.oauth_token,
    oauth_nonce : n(),
    oauth_timestamp : Date.now(),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };
 
  /* We combine all the parameters in order of importance */ 
  var parameters = _.assign(set_param, required_parameters);

  /* We set our secrets here */
  var consumerSecret = process.env.consumerSecret;
  var tokenSecret = process.env.tokenSecret;

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;

  /* Then we use request to send make the API Request */
  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });

};

module.exports = request_yelp;