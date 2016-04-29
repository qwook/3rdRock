
import './src/ImageLoader_Overwrite.js'

import * as Loaders from './src/Loaders.js';
import EarthObject from './src/EarthObject.js';

import BottomSide from "./src/BottomSide.js";
import RightSide from "./src/RightSide.js";
import LeftSide from "./src/LeftSide.js";

global.events = new THREE.EventDispatcher();

// Load up react
ReactDOM.render(<BottomSide />, document.getElementById("bottomSide"));
ReactDOM.render(<RightSide />, document.getElementById("rightSide"));
ReactDOM.render(<LeftSide />, document.getElementById("leftSide"));

Promise.all([
  Loaders.CacheTexture('images/2_no_clouds_4k.jpg'),
  // Loaders.CacheTexture('images/elev_bump_4k.jpg'),
  Loaders.CacheTexture('images/water_4k.png'),
  Loaders.CacheTexture('images/skybox.jpg'),
  Loaders.CacheTexture('images/hemisphere.png'),
  Loaders.CacheTexture('images/current_location.png'),
  Loaders.CacheTexture('images/beacon.png'),
  Loaders.CacheTexture('images/earthbump.png'),
  // Loaders.CacheTexture('images/earth_normal.png'),
  // Loaders.CacheTexture('images/earth_lights_lrg.jpg'),
  // Loaders.CacheTexture('images/World-satellite map.png'),
  Loaders.CacheTexture('images/Earth-clouds-1.png'),
  // Loaders.CacheTexture('images/yes.png'),
  Loaders.CacheTexture('images/edge_alpha.png'),
  Loaders.CacheTexture('images/neural.png'),

  Loaders.CacheJSON('dataForHenry.json')
]).then(function() {

  var canvas = document.getElementById("earth");

  var width  = window.innerWidth,
      height = window.innerHeight;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
  camera.position.z = 15;
  camera.position.x = -5;
  camera.position.y = 10;
  global.camera = camera;

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(width, height);
  global.renderer = renderer;

  // Lighting

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 0, 1, 0 );
  scene.add( directionalLight );

  var directionalLight2 = new THREE.AmbientLight( 0xffffff, 0.5 );
  scene.add( directionalLight2 );

  global.calc3Dto2D = function (vector) {
    return vector.clone().project(camera);
  }

  var controls = new THREE.TrackballControls(camera, document.getElementById("canvasWrapper"));
  controls.noPan = true;
  controls.minDistance = 12;
  controls.maxDistance = 35;
  controls.dynamicDampingFactor = 0.4
  controls.rotateSpeed = 0.5;

  global.controls = controls;

  // Skybox

  var skybox = new THREE.Mesh(
    new THREE.SphereGeometry(500, 50, 50),
    new THREE.MeshBasicMaterial({
      map: Loaders.Texture('images/skybox.jpg'),
      side: THREE.BackSide
    })
  );
  scene.add(skybox);

  // Hemisphere

  var map = Loaders.Texture("images/hemisphere.png");
  // var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, transparent: true, fog: true } );
  // var sprite = new THREE.Sprite( material );
  // sprite.scale.set(35,35,35);
  // scene.add( sprite );

  global.TwoDscene = new THREE.Scene();
  global.TwoDcamera = new THREE.Camera(-0.5, 0.5, -0.5, 0.5, -1, 10000);

  var test = new THREE.Object3D();

  var planeMesh = new THREE.PlaneGeometry(2, 2);
  global.TwoDplane = new THREE.Mesh(planeMesh, new THREE.MeshBasicMaterial({
    map: Loaders.Texture('images/hemisphere.png')
  }));
  test.add(TwoDplane);

  global.TwoDplane1 = new THREE.Mesh(planeMesh, new THREE.MeshBasicMaterial({
    map: Loaders.Texture('images/hemisphere.png')
  }));
  test.add(TwoDplane1);

  global.TwoDplane2 = new THREE.Mesh(planeMesh, new THREE.MeshBasicMaterial({
    map: Loaders.Texture('images/hemisphere.png')
  }));
  test.add(TwoDplane2);

  global.TwoDplane3 = new THREE.Mesh(planeMesh, new THREE.MeshBasicMaterial({
    map: Loaders.Texture('images/hemisphere.png')
  }));
  test.add(TwoDplane3);

  test.scale.y = 2;
  TwoDscene.add(test);


  var earth = new EarthObject();
  earth.rotation.x = -Math.PI/2;
  scene.add(earth);
  global.earth = earth;

  var fakeData = Loaders.getJSON("dataForHenry.json");
  console.log(fakeData);
  for (var i in fakeData.events) {
    earth.addEvent(fakeData.events[i]);
  }

  var plane = new THREE.PlaneGeometry(1, 1);

  var mat = new THREE.MeshBasicMaterial({
      map: map,
      transparent: true
    })

  var yo = new THREE.Mesh(plane, mat);

  scene.add(yo);

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  global.currentTime = (new Date()).getTime();
  global.lastTime = global.currentTime;
  global.deltaTime = 0;

  // Rendering Every Frame
  var render = function() {
    requestAnimationFrame(render);

    global.currentTime = (new Date()).getTime();
    global.deltaTime = global.currentTime - global.lastTime;

    global.events.dispatchEvent({type: "update"});

    controls.update();
    
    var opacity = 1/(camera.position.length())*100 + 35;
    yo.scale.set(opacity,opacity,opacity);
    yo.rotation.copy(camera.rotation);

    // sprite.position = camera.position.clone().multiplyScalar(-1);


    earth.update();
    renderer.render(scene, camera);
    // renderer.render(TwoDscene, TwoDcamera);

    global.lastTime = global.currentTime;
  };
  render();

});

