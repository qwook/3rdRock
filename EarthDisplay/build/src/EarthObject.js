define(['exports', './Loaders.js', './Tweet.js'], function (exports, _Loaders, _Tweet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Loaders = _interopRequireWildcard(_Loaders);

  var _Tweet2 = _interopRequireDefault(_Tweet);

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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var raycaster = new THREE.Raycaster();

  var mouse = new THREE.Vector2();

  document.body.addEventListener('mousemove', onMouseMove, false);

  var leftSide = document.getElementById("leftSide");
  var rightSide = document.getElementById("rightSide");
  var biggieSmalls = document.getElementById("biggieSmalls");
  var closeButton = document.getElementById("close");

  var onCanvas = false;
  function onMouseMove(event) {

    onCanvas = event.target.id == "earth";

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  var EarthObject = function (_THREE$Object3D) {
    _inherits(EarthObject, _THREE$Object3D);

    function EarthObject() {
      _classCallCheck(this, EarthObject);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EarthObject).call(this));

      // Loaders.Texture('images/elev_bump_4k.jpg').generateMipmaps = true;

      Promise.all([Loaders.CacheTexture('/map/0/0'), Loaders.CacheTexture('/map/1/0'), Loaders.CacheTexture('/map/1/1'), Loaders.CacheTexture('/map/0/1')]).then(function (texture) {

        global.TwoDplane.material.map = Loaders.Texture('/map/0/0');
        global.TwoDplane.scale.x = 0.5;
        global.TwoDplane.scale.y = 0.5;
        global.TwoDplane.position.x = -0.5;
        global.TwoDplane.position.y = 0.5;

        global.TwoDplane1.material.map = Loaders.Texture('/map/1/0');
        global.TwoDplane1.scale.x = 0.5;
        global.TwoDplane1.scale.y = 0.5;
        global.TwoDplane1.position.x = -0.5;
        global.TwoDplane1.position.y = -0.5;

        global.TwoDplane2.material.map = Loaders.Texture('/map/0/1');
        global.TwoDplane2.scale.x = 0.5;
        global.TwoDplane2.scale.y = 0.5;
        global.TwoDplane2.position.x = 0.5;
        global.TwoDplane2.position.y = 0.5;

        global.TwoDplane3.material.map = Loaders.Texture('/map/1/1');
        global.TwoDplane3.scale.x = 0.5;
        global.TwoDplane3.scale.y = 0.5;
        global.TwoDplane3.position.x = 0.5;
        global.TwoDplane3.position.y = -0.5;

        // renderer.render(TwoDscene, TwoDcamera);
        renderer.render(TwoDscene, TwoDcamera, _this.renderTarget);
        // renderer.render(TwoDscene, TwoDcamera);
      });

      _this.renderTarget = new THREE.WebGLRenderTarget(1024 * 4, 1024 * 4);
      // global.TwoDplane.material.map = Loaders.Texture('images/2_no_clouds_4k.jpg');
      // renderer.render(TwoDscene, TwoDcamera, this.renderTarget);

      _this.globeMesh = new THREE.Mesh(new THREE.SphereGeometry(10, 50, 50), new THREE.MeshPhongMaterial({
        // map: this.renderTarget,
        map: Loaders.Texture('images/2_no_clouds_4k.jpg'),
        bumpMap: Loaders.Texture('images/earthbump.png'),
        bumpScale: 0.3,
        // normalMap: Loaders.Texture('images/earth_normal.png'),
        // normalScale: new THREE.Vector2(0.3,0.3),
        specularMap: Loaders.Texture('images/water_4k.png'),
        specular: new THREE.Color('grey')
      }));
      // wireframe: true
      _this.add(_this.globeMesh);
      _this.globeMesh.rotation.x = Math.PI / 2;

      _this.globeMeshSatellite = new THREE.Mesh(new THREE.SphereGeometry(10, 50, 50), new THREE.MeshBasicMaterial({
        map: _this.renderTarget
      }));
      _this.add(_this.globeMeshSatellite);
      _this.globeMeshSatellite.rotation.x = Math.PI / 2;

      _this.outlineMesh = new THREE.Mesh(new THREE.SphereGeometry(10.1, 50, 50), new THREE.MeshBasicMaterial({
        // map: Loaders.Texture('images/yes.png'),
        alphaMap: Loaders.Texture('images/edge_alpha.png'),
        transparent: true
      }));
      _this.add(_this.outlineMesh);
      _this.outlineMesh.rotation.x = Math.PI / 2;

      _this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(10.1, 50, 50), new THREE.MeshBasicMaterial({
        map: Loaders.Texture('images/Earth-clouds-1.png'),
        transparent: true
      }));
      _this.add(_this.cloudMesh);

      _this.cloudMesh.rotation.x = Math.PI / 2;
      _this.beacons = [];
      _this.current = "standard";

      // todo: destroy these event listeners...

      window.addEventListener('click', function (e) {
        if (e.target.id == "earth") {
          if (_this.lastIntersect) {
            _this.lastIntersect.object.parent.parent.onClick();
          }
        }
      });

      controls.addEventListener('change', function () {
        if (controls.locking) {
          return;
        }

        leftSide.className = "inside";
        rightSide.className = "inside";
        biggieSmalls.className = "inside";
      });

      closeButton.addEventListener('click', function () {
        leftSide.className = "inside";
        rightSide.className = "inside";
        biggieSmalls.className = "inside";
      });

      return _this;
    }

    _createClass(EarthObject, [{
      key: 'addEvent',
      value: function addEvent(event) {
        var tweet = new _Tweet2.default(event);
        var geo = event.geometries[0];

        var pos;
        if (geo.type == "Point") {
          pos = event.geometries[0].coordinates;
        } else {
          pos = event.geometries[0].coordinates[0][0];
        }
        event.coords = { lat: pos[1], long: pos[0] };

        tweet.position.copy(this.latLongAltToPoint(pos[1], pos[0], 10));
        this.add(tweet);

        this.beacons.push(tweet);
      }
    }, {
      key: 'update',
      value: function update() {
        // var i = 0;
        // for (var coord of this.positions) {
        //   var pos = this.latLongAltToPoint(coord[0], coord[1], coord[2]);

        //   this.cubes[i].position.copy(pos);
        //   i++;

        // }
        // console.log("yo")

        if (this.current == "standard") {
          this.globeMesh.visible = true;
          this.globeMeshSatellite.visible = false;
          this.outlineMesh.visible = false;
          this.cloudMesh.visible = true;
        } else {
          this.globeMesh.visible = false;
          this.globeMeshSatellite.visible = true;
          this.outlineMesh.visible = true;
          this.cloudMesh.visible = false;
        }

        raycaster.setFromCamera(mouse, camera);

        if (onCanvas) {
          // calculate objects intersecting the picking ray
          var mesh = [];
          for (var i in this.beacons) {
            mesh.push(this.beacons[i].beacon.mesh);
          }
          mesh.push(this.globeMesh);

          var intersects = raycaster.intersectObjects(mesh);

          if (intersects[0] && intersects[0].object != this.globeMesh) {

            if (this.lastIntersect && intersects[0].object != this.lastIntersect.object) {
              this.lastIntersect.object.parent.parent.stopHover();
            };

            if (intersects[0] && (!this.lastIntersect || intersects[0].object != this.lastIntersect.object)) {
              intersects[0].object.parent.parent.startHover();
            }
            this.lastIntersect = intersects[0];
          } else {
            this.lastIntersect = null;
          }
        }

        this.cloudMesh.rotation.y += deltaTime / 10000;

        var opacity = camera.position.length() / 15 - 1;

        if (opacity < 0) {
          opacity = 0;
        }

        if (opacity > 1) {
          opacity = 1;
        }

        this.cloudMesh.material.opacity = opacity;
      }
    }, {
      key: 'sinTest',
      value: function sinTest() {
        return (Math.sin(new Date().getTime() / 100) + 1) / 2;
      }
    }, {
      key: 'latLongAltToPoint',
      value: function latLongAltToPoint(lat, long, rho) {
        var phi = lat * Math.PI / 180; // + this.sinTest()*Math.PI/2;
        // var phi = long * Math.PI/180;
        var theta = long * Math.PI / 180 + Math.PI;
        var x = Math.cos(phi) * Math.cos(theta) * -rho;
        var y = Math.cos(phi) * Math.sin(theta) * -rho;
        var z = Math.sin(phi) * rho;
        return new THREE.Vector3(x, y, z);
      }
    }]);

    return EarthObject;
  }(THREE.Object3D);

  exports.default = EarthObject;
});
//# sourceMappingURL=EarthObject.js.map
