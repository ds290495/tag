var tools = require('./tools.js')
var https = require('https')
var url = require('url')
var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  var token = tools.getToken(req.session)
  
  if(!token) return res.redirect('/')

  // Don't call OpenID if we didn't request OpenID scopes
  
  if(!tools.containsOpenId()) return res.send('connected')

  // Call OpenID endpoint
  // (this example uses the raw `https` npm module)
  // (see api_call.js for example using helper `request` npm module)
  
  var options = token.sign(url.parse(tools.openid_uri))
  
  var request = https.request(options, (response) => {
    response.setEncoding('utf8');
    let rawData = '';
    response.on('data', (chunk) => rawData += chunk);
    response.on('end', () => {
     
      try {
        var parsedData = JSON.parse(rawData)
        res.render('<script>window.close()</script>', parsedData)
        
      } catch (e) {
       
        res.render('<script>window.close()</script>')
      }
    });
  });
  request.end();

  request.on('error', (e) => {
    console.error(e)
    res.send(e)
  })
})

module.exports = router
