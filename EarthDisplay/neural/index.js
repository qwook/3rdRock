
var PNG = require('pngjs').PNG;
var convnetjs = require('convnetjs')
var fs = require('fs');

var NeuralComputation = require('../src/NeuralComputation.js');

var sections = JSON.parse(fs.readFileSync('public/sections.json', 'utf8'));
var data = JSON.parse(fs.readFileSync('public/events.json', 'utf8'));

var computation = new NeuralComputation(convnetjs, data, sections);

if (fs.existsSync('bigNeuralNet.json')) {
  computation.loadJson(JSON.parse(fs.readFileSync('bigNeuralNet.json')).out);
  console.log("loaded");
}

if (process.argv[2] == "save") {

  var width = 1026;
  var height = 1026;

  var png = new PNG({
    filterType: 4,
    width: width,
    height: height
  });

  computation.save(width, height, (x, y, r, g, b) => {
    var idx = (width * y + x) << 2;

    png.data[idx] = r;
    png.data[idx+1] = g;
    png.data[idx+2] = b;
    png.data[idx+3] = 255;
  });

  console.log("lol")

  png.pack().pipe(fs.createWriteStream('out.png'));

  return;
}

for (var i = 0; true; i++) {
  computation.train();
  if (i % 100 == 0) {
    fs.writeFileSync('bigNeuralNet.json', computation.getJson(), 'utf8');
  }
}

