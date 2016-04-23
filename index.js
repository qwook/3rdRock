var http = require('http');
var Twitter = require('twitter');

//grabbing Data from EONET
var options = {
  host: 'eonet.sci.gsfc.nasa.gov',
  path: '/api/v2.1/events'
};

callback = function(response) {
  var data;
  var str = "";

  response.on('data', function (chunk) {
    str += chunk.toString();
  });


  response.on('end', function () {
    data = JSON.parse(str)
    data.events.forEach(function(event) {
        console.log(event.title)
    })
  });
}

http.request(options, callback).end();

//Twitter API
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});