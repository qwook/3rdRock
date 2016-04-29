
import './src/ImageLoader_Overwrite.js'

import * as Loaders from './src/Loaders.js';

import NeuralComputation from './src/NeuralComputation.js';

Promise.all([
  Loaders.CacheJSON('events.json'),
  Loaders.CacheJSON('sections.json'),
  Loaders.CacheJSON('bigNeuralNet.json')
]).then(function() {

  var sections = Loaders.getJSON('sections.json');
  var data = Loaders.getJSON('events.json');
  var bigNeuralNet = Loaders.getJSON('bigNeuralNet.json');

  var computation = new NeuralComputation(convnetjs, data, sections);

  var canvas = document.getElementById("neural");

  computation.loadJson(bigNeuralNet.out);
  computation.draw(canvas);

  // setInterval(function() {
  //   computation.train();
  //   computation.draw(canvas);
  // }, 10);

});
