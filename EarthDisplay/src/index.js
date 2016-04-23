
import EarthObject from './src/EarthObject.js';

var canvas = document.getElementById("earth");

var width  = canvas.width,
    height = canvas.height;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
camera.position.z = 15;
camera.position.x = -10;
camera.position.y = -15;

var renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(width, height);

var earth = new EarthObject();
scene.add(earth);

var controls = new THREE.TrackballControls(camera);

// Rendering Every Frame
var render = function() {
  requestAnimationFrame(render);

  earth.update();
  controls.update();
  renderer.render(scene, camera);
};
render();
