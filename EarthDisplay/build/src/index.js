define(['./src/Loaders.js', './src/EarthObject.js'], function (_Loaders, _EarthObject) {
  'use strict';

  var Loaders = _interopRequireWildcard(_Loaders);

  var _EarthObject2 = _interopRequireDefault(_EarthObject);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  global.events = new THREE.EventDispatcher();

  Promise.all([Loaders.CacheTexture('images/2_no_clouds_4k.jpg'), Loaders.CacheTexture('images/elev_bump_4k.jpg'), Loaders.CacheTexture('images/water_4k.png'), Loaders.CacheTexture('images/skybox.jpg'), Loaders.CacheTexture('images/hemisphere.png'), Loaders.CacheTexture('images/beacon.png'), Loaders.CacheJSON('dataForHenry.json')]).then(function () {

    var canvas = document.getElementById("earth");

    var width = window.innerWidth,
        height = window.innerHeight;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
    camera.position.z = 15;
    camera.position.x = 0;
    camera.position.y = 0;
    global.camera = camera;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);

    // Lighting

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    var directionalLight = new THREE.HemisphereLight(0xffffff, 0.5);
    scene.add(directionalLight);

    global.calc3Dto2D = function (vector) {
      return vector.clone().project(camera);
    };

    var controls = new THREE.TrackballControls(camera);

    // Skybox

    var skybox = new THREE.Mesh(new THREE.SphereGeometry(500, 50, 50), new THREE.MeshBasicMaterial({
      map: Loaders.Texture('images/skybox.jpg'),
      side: THREE.BackSide
    }));
    scene.add(skybox);

    // Hemisphere

    var map = Loaders.Texture("images/hemisphere.png");
    // var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, transparent: true, fog: true } );
    // var sprite = new THREE.Sprite( material );
    // sprite.scale.set(35,35,35);
    // scene.add( sprite );

    var earth = new _EarthObject2.default();
    earth.rotation.x = -Math.PI / 2;
    scene.add(earth);

    var fakeData = Loaders.getJSON("dataForHenry.json");
    console.log(fakeData);
    for (var i in fakeData.events) {
      earth.addEvent(fakeData.events[i]);
    }

    var plane = new THREE.PlaneGeometry(1, 1);

    var mat = new THREE.MeshBasicMaterial({
      map: map,
      transparent: true
    });

    var yo = new THREE.Mesh(plane, mat);

    scene.add(yo);

    window.addEventListener('resize', function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Rendering Every Frame
    var render = function () {
      requestAnimationFrame(render);

      global.events.dispatchEvent({ type: "update" });

      controls.update();

      var opacity = 1 / camera.position.length() * 100 + 35;
      yo.scale.set(opacity, opacity, opacity);
      yo.rotation.copy(camera.rotation);

      // sprite.position = camera.position.clone().multiplyScalar(-1);

      earth.update();
      renderer.render(scene, camera);
    };
    render();
  });
});
//# sourceMappingURL=index.js.map
