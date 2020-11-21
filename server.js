const express = require('express');
const request = require('request');
const querystring = require('querystring');

const backend = express();

/* 

  gustavfahraeus @ GitHub  |  ☂️ 2020 
  -----

  oAuth bridge.

*/

let callbackURL = 'https://spotifydatadoodle-oauth/callback';
let mySpotifyDataID = '71e4a39fe7874226a42817b78e4038ee'; 
let mySpotifyDataSecret = 'aLittleSecret😊';

/* Sending the user to Spotify to get permission to play. */
backend.get('/login', (request, response) => {
  response.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      client_id: mySpotifyDataID,
      response_type: 'code',
      redirect_uri: callbackURL,
      scope: 'user-top-read',
    }))
});

/* The user comes back from Spotify */
backend.get('/callback', function(req, res) {
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',

    form: {
      code: req.query.code,
      redirect_uri: callbackURL,
      grant_type: 'authorization_code'
    },

    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        mySpotifyDataID + ':' + mySpotifyDataSecret
      ).toString('base64'))
    },

    json: true
  }

  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = 'https://spotifydatadoodle.herokuapp.com'
    res.redirect(uri + '?access_token=' + access_token) // I can remove the access_token here if I do everything on the backend.
  })
})


// CLI Message
let port = (process.env.PORT || 8888)
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
backend.listen(port)




