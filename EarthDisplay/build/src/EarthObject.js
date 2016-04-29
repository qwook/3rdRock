define(['exports', './Loaders.js', './Tweet.js', './CurrentLocation.js', './CategoryColors.js'], function (exports, _Loaders, _Tweet, _CurrentLocation, _CategoryColors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Loaders = _interopRequireWildcard(_Loaders);

  var _Tweet2 = _interopRequireDefault(_Tweet);

  var _CurrentLocation2 = _interopRequireDefault(_CurrentLocation);

  var CategoryColors = _interopRequireWildcard(_CategoryColors);

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
  document.body.addEventListener('click', onClick, false);

  var leftSide = document.getElementById("leftSide");
  var rightSide = document.getElementById("rightSide");
  var biggieSmalls = document.getElementById("biggieSmalls");
  var closeButton = document.getElementById("close");
  var misterWorldWide = document.getElementById("misterWorldWide");

  var onCanvas = false;
  function onMouseMove(event) {

    onCanvas = event.target.id == "earth";

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    misterWorldWide.style.right = window.innerWidth - event.clientX + "px";
    misterWorldWide.style.bottom = window.innerHeight - event.clientY + 30 + "px";
  }

  var lastClick = 0;
  function onClick(event) {
    if (event.target.id == "earth") {
      var currentClick = new Date().getTime();

      if (currentClick - lastClick < 250) {
        earth.doubleClick(event);
      }

      lastClick = currentClick;
    }
  }

  var lastMouseDown = 0;
  document.getElementById("earth").addEventListener('mousedown', function () {
    lastMouseDown = new Date().getTime();
  });

  document.body.addEventListener('mouseup', function (event) {
    var currentClick = new Date().getTime();

    if (currentClick - lastMouseDown < 200) {
      earth.tap(event);
    }
  }, false);

  var EarthObject = function (_THREE$Object3D) {
    _inherits(EarthObject, _THREE$Object3D);

    function EarthObject() {
      _classCallCheck(this, EarthObject);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EarthObject).call(this));

      // Loaders.Texture('images/elev_bump_4k.jpg').generateMipmaps = true;

      Promise.all([Loaders.CacheTexture('map/0/0.jpeg'), Loaders.CacheTexture('map/1/0.jpeg'), Loaders.CacheTexture('map/1/1.jpeg'), Loaders.CacheTexture('map/0/1.jpeg')]).then(function (texture) {

        global.TwoDplane.material.map = Loaders.Texture('map/0/0.jpeg');
        global.TwoDplane.scale.x = 0.5;
        global.TwoDplane.scale.y = 0.5;
        global.TwoDplane.position.x = -0.5;
        global.TwoDplane.position.y = 0.5;

        global.TwoDplane1.material.map = Loaders.Texture('map/1/0.jpeg');
        global.TwoDplane1.scale.x = 0.5;
        global.TwoDplane1.scale.y = 0.5;
        global.TwoDplane1.position.x = -0.5;
        global.TwoDplane1.position.y = -0.5;

        global.TwoDplane2.material.map = Loaders.Texture('map/0/1.jpeg');
        global.TwoDplane2.scale.x = 0.5;
        global.TwoDplane2.scale.y = 0.5;
        global.TwoDplane2.position.x = 0.5;
        global.TwoDplane2.position.y = 0.5;

        global.TwoDplane3.material.map = Loaders.Texture('map/1/1.jpeg');
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

      _this.neuralMesh = new THREE.Mesh(new THREE.SphereGeometry(10.1, 50, 50), new THREE.MeshBasicMaterial({
        map: Loaders.Texture('images/neural.png'),
        opacity: 0.5,
        transparent: true
      }));
      _this.add(_this.neuralMesh);
      _this.neuralMesh.rotation.x = Math.PI / 2;

      _this.neuralImg = new Image();
      _this.neuralImg.src = 'images/neural.png';
      _this.neuralImg.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = _this.neuralImg.width;
        canvas.height = _this.neuralImg.height;
        canvas.getContext('2d').drawImage(_this.neuralImg, 0, 0, _this.neuralImg.width, _this.neuralImg.height);
        _this.neuralCanvas = canvas;
      };

      _this.hovering = false;

      _this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(10.1, 50, 50), new THREE.MeshBasicMaterial({
        map: Loaders.Texture('images/Earth-clouds-1.png'),
        transparent: true
      }));
      _this.add(_this.cloudMesh);

      _this.cloudMesh.rotation.x = Math.PI / 2;
      _this.beacons = [];
      _this.current = "standard";
      _this.currentCat = "None";

      // todo: destroy these event listeners...

      // window.addEventListener( 'click', (e) => {
      //   if (e.target.id == "earth") {
      //     if (this.lastIntersect) {
      //       this.lastIntersect.object.parent.parent.onClick();
      //     }

      //     e.preventDefault();
      //   }
      // });

      controls.addEventListener('change', function () {
        if (controls.locking) {
          return;
        }

        leftSide.className = "inside";
        rightSide.className = "inside";
        biggieSmalls.className = "inside";

        var tweet = _this.showingInfo;
        _this.showingInfo = false;
        if (tweet) {

          var children = tweet.tweetEle.parentNode.childNodes;
          for (var i in children) {
            var child = children[i];
            if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
              child.overrideOpacity = false;
            }
          }
          tweet.beacon.mesh.material.opacity = 0.5;
        }
      });

      closeButton.addEventListener('click', function () {
        leftSide.className = "inside";
        rightSide.className = "inside";
        biggieSmalls.className = "inside";

        var tweet = _this.showingInfo;
        _this.showingInfo = false;
        if (tweet) {
          tweet.stopHover();
        }
      });

      navigator.geolocation.getCurrentPosition(function (geo) {
        var currentLocation = new _CurrentLocation2.default({ lat: geo.coords.latitude, long: geo.coords.longitude });

        currentLocation.position.copy(_this.latLongAltToPoint(geo.coords.latitude, geo.coords.longitude, 10));
        _this.add(currentLocation);
        console.log(geo.coords);

        _this.currentLocation = currentLocation;
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
      key: 'tap',
      value: function tap(event) {

        if (event.target.id == "earth") {
          if (this.lastIntersect) {
            this.lastIntersect.object.parent.parent.onClick();
            controls.forceOut();
          }
        }

        if (this.globeIntersect) {
          console.log(this.current);
          if (this.current == "neural") {
            // leftSide.className = "";
            rightSide.className = "";
            biggieSmalls.className = "";
            // leftSide.scrollTop = 0;
            rightSide.scrollTop = 0;
            biggieSmalls.scrollTop = 0;
            events.dispatchEvent({ type: 'changeFocus', data: { twitter: null, currentLocation: this.currentCat, current: false } });
          }
        }
      }
    }, {
      key: 'doubleClick',
      value: function doubleClick(event) {

        if (this.globeIntersect) {
          // camera.position.copy( lol );

          var pt = this.globeIntersect.point.clone();

          // console.log(pt);
          // console.log(pt.length());
          // console.log(camera.position.length());

          pt.divideScalar(pt.length());
          pt.multiplyScalar(camera.position.length());

          // console.log(pt);

          this.goal = pt;
          this.isGoing = true;

          controls.enabled = false;
          // controls.locking = true;
          event.preventDefault();
        }
      }
    }, {
      key: 'categoryFromLatLong',
      value: function categoryFromLatLong(lat, long) {
        var pos2D = this.latLongToXY(lat, long, 1026, 1026);
        var pixelData = this.neuralCanvas.getContext('2d').getImageData(Math.floor(pos2D.x), Math.floor(pos2D.y), 1, 1).data;

        return CategoryColors.getCategoryFromColor(pixelData[0], pixelData[1], pixelData[2]);
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

        if (this.isGoing) {
          camera.position.lerp(this.goal, 0.1);
          if (camera.position.distanceTo(this.goal) < 0.1) {
            this.isGoing = false;
            controls.enabled = true;
          }
        }

        if (this.current == "standard") {
          this.globeMesh.visible = true;
          this.globeMeshSatellite.visible = false;
          this.outlineMesh.visible = false;
          this.cloudMesh.visible = true;
          this.neuralMesh.visible = false;
        } else if (this.current == "neural") {
          this.globeMesh.visible = true;
          this.globeMeshSatellite.visible = false;
          this.outlineMesh.visible = false;
          this.cloudMesh.visible = false;
          this.neuralMesh.visible = true;
        } else {
          this.globeMesh.visible = false;
          this.globeMeshSatellite.visible = true;
          this.outlineMesh.visible = true;
          this.cloudMesh.visible = false;
          this.neuralMesh.visible = false;
        }

        if (this.current == "neural") {
          for (var beacon of this.beacons) {
            beacon.visible = false;
          }
        } else {
          for (var beacon of this.beacons) {
            beacon.visible = true;
          }
        }

        raycaster.setFromCamera(mouse, camera);

        if (this.hovering) {
          misterWorldWide.style.display = 'none';
        }

        if (onCanvas) {
          // calculate objects intersecting the picking ray
          var mesh = [];

          if (this.current != "neural") {
            for (var i in this.beacons) {
              mesh.push(this.beacons[i].beacon.mesh);
            }
          }

          mesh.push(this.globeMesh);

          if (this.currentLocation) {
            mesh.push(this.currentLocation.beacon.mesh);
          }

          var olVis = this.globeMesh.visible;
          this.globeMesh.visible = true;
          var intersects = raycaster.intersectObjects(mesh);
          this.globeMesh.visible = olVis;

          this.globeIntersect = null;

          if (intersects[0] && intersects[0].object != this.globeMesh) {

            if (this.lastIntersect && intersects[0].object != this.lastIntersect.object) {
              this.lastIntersect.object.parent.parent.stopHover();
            };

            if (intersects[0] && (!this.lastIntersect || intersects[0].object != this.lastIntersect.object)) {
              intersects[0].object.parent.parent.startHover();
            }
            this.lastIntersect = intersects[0];

            misterWorldWide.style.display = 'none';
          } else {
            if (this.lastIntersect) {
              this.lastIntersect.object.parent.parent.stopHover();
            }
            this.lastIntersect = null;

            if (intersects[0] && intersects[0].object == this.globeMesh) {
              this.globeIntersect = intersects[0];
            }

            // Mouse if over the globe during neural mode
            if (!this.showingInfo && this.current == "neural" && intersects[0] && intersects[0].object == this.globeMesh) {

              var point = this.worldToLocal(intersects[0].point.clone());
              var rho = point.length();
              var coords = this.pointToLongLat(point.x, point.y, point.z, rho);
              if (coords.lat < -90) {
                coords.lat += 360;
              }

              // Display data about where the user is hovering
              var pos2D = this.latLongToXY(coords.lat, coords.long, 1026, 1026);
              var pixelData = this.neuralCanvas.getContext('2d').getImageData(pos2D.x, pos2D.y, 1, 1).data;

              var category = CategoryColors.getCategoryFromColor(pixelData[0], pixelData[1], pixelData[2]);
              misterWorldWide.textContent = category;
              misterWorldWide.style.display = 'inline-block';
              this.currentCat = category;
            } else {
              misterWorldWide.style.display = 'none';
            }
          }
        }

        // Cloud rotation and opacity
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
      key: 'latLongToXY',
      value: function latLongToXY(latitude, longitude, width, height) {
        var x = (longitude + 180) / 360 * width;
        var y = (-latitude + 90) / 180 * height;

        return { x: x, y: y };
      }
    }, {
      key: 'pointToLongLat',
      value: function pointToLongLat(x, y, z, rho) {
        var phi = Math.asin(z / rho);
        var theta = Math.atan2(y, x);

        var lat = phi / (Math.PI / 180);
        var long = (theta - Math.PI) / (Math.PI / 180) + 180;

        return { lat: lat, long: long };
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
