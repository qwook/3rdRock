
var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(express.static('build'));

app.listen(3000);

console.log("Up and running at 3000!");
