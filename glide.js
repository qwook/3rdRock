
var http = require('http');
var jsdom = require('jsdom');
var querystring = require('querystring');
var fs = require('fs');
var Promise = require("bluebird");

var jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.js', 'utf8');

var events = [];

function submitForm(itemOffset) {

  // Emulate submitting a form
  var postData = querystring.stringify({
    'level0': '*',
    'level1': '*',
    'events': '*',
    'nStart': new String(itemOffset)
  });

  var options = {
    hostname: 'www.glidenumber.net',
    port: 80,
    path: '/glide/public/search/search.jsp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  return new Promise(function (resolve, reject) {

    var req = http.request(options, (res) => {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(body);
      })
    })
    .on('error', (e) => {
      throw(e);
    })
    req.write(postData)
    req.end();

  }).then(function(body) {

    return new Promise(function(resolve, reject) {
      // This creates a fake "browser"
      jsdom.env({
        html: body,
        src: [jquery],
        done: function(err, window) {
          // Now you can run jquery objects in this fake browser
          var $ = window.$;

          var rowId = 0;
          for (var row of $('tr.bgLightLight')) {
            console.log("----- ROW " + rowId);
            var colId = 0;
            for (var col of $('td.basefontSmall', $(row))) {
              console.log("===== COLUMN " + colId)
              console.log($(col).text());
              colId++
            }
            rowId++;
          }

          resolve();

          // Aris you need to push each row of the table
          // events.push()
        }
      });
    })

  });

}

var promises = [];
for (var i = 0; i < 6150; i += 25) {
  if (i > 10) { // remove these 3 lines if you want to scrape everything
    return;
  }

  promises.push(submitForm(i));
}
Promise.all(promises);