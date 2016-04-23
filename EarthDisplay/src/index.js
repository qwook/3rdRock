
import * as Loaders from './src/Loaders.js';
import EarthObject from './src/EarthObject.js';

global.events = new THREE.EventDispatcher();

Promise.all([
  Loaders.CacheTexture('images/2_no_clouds_4k.jpg'),
  Loaders.CacheTexture('images/elev_bump_4k.jpg'),
  Loaders.CacheTexture('images/water_4k.png'),
]).then(function() {

  var canvas = document.getElementById("earth");

  var width  = canvas.width,
      height = canvas.height;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
  camera.position.z = 15;
  camera.position.x = 0;
  camera.position.y = 0;
  global.camera = camera;

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(width, height);

  var earth = new EarthObject();
  earth.rotation.x = -Math.PI/2;
  scene.add(earth);

  // Lighting

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 0, 1, 0 );
  scene.add( directionalLight );

  var directionalLight = new THREE.HemisphereLight( 0xffffff, 0.5 );
  scene.add( directionalLight );

  global.calc3Dto2D = function (vector) {
    return vector.clone().project(camera);
  }

  var controls = new THREE.TrackballControls(camera);

  // Rendering Every Frame
  var render = function() {
    requestAnimationFrame(render);

    global.events.dispatchEvent({type: "update"});

    earth.update();
    controls.update();
    renderer.render(scene, camera);
  };
  render();

});

