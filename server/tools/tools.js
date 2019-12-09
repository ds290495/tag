var request = require('request');
var config = require('../config.json');

var Tools = function () {
  var tools = this;

  

  

  // Should be used to check for 401 response when making an API call.  If a 401
  // response is received, refresh tokens should be used to get a new access token,
  // and the API call should be tried again.
  


  // Refresh Token should be called if access token expires, or if Intuit
  // returns a 401 Unauthorized.
  


  

  

  // Get the token object from session storage
  

  

  
}

module.exports = new Tools();
