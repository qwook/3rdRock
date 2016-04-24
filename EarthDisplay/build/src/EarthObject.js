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

  var EarthObject = function (_THREE$Object3D) {
    _inherits(EarthObject, _THREE$Object3D);

    function EarthObject() {
      _classCallCheck(this, EarthObject);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EarthObject).call(this));

      _this.globeMesh = new THREE.Mesh(new THREE.SphereGeometry(10, 50, 50), new THREE.MeshPhongMaterial({
        map: Loaders.Texture('images/2_no_clouds_4k.jpg'),
        bumpMap: Loaders.Texture('images/elev_bump_4k.jpg'),
        bumpScale: 0.5,
        specularMap: Loaders.Texture('images/water_4k.png'),
        specular: new THREE.Color('grey')
      }));
      // wireframe: true
      _this.add(_this.globeMesh);
      _this.globeMesh.rotation.x = Math.PI / 2;

      _this.positions = [[37.3470201, -121.8935645, 10], [40.776255, -74.0137496, 10]];

      _this.cubes = [];

      for (var coord of _this.positions) {

        var pos = _this.latLongAltToPoint(coord[0], coord[1], coord[2]);

        var geometry = new THREE.SphereGeometry(0.5, 5, 5);
        var material;
        if (coord[1] > 0) {
          console.log("YOO");
          material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        } else if (coord[1] == 0) {
          material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        } else {
          material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        }
        var cube = new THREE.Mesh(geometry, material);
        cube.position.copy(pos);
        _this.add(cube);

        _this.cubes.push(cube);
      }

      // var tweet = new Tweet({message: "Hey what's up my dude!"});
      // tweet.position.copy(this.latLongAltToPoint(40.776255,-74.0137496, 10));
      // this.add(tweet);

      return _this;
    }

    _createClass(EarthObject, [{
      key: 'addEvent',
      value: function addEvent(event) {
        var tweet = new _Tweet2.default({ message: event.title });
        var geo = event.geometries[0];

        var pos;
        if (geo.type == "Point") {
          pos = event.geometries[0].coordinates;
        } else {
          pos = event.geometries[0].coordinates[0][0];
        }

        console.log(pos);

        tweet.position.copy(this.latLongAltToPoint(pos[1], pos[0], 10));
        this.add(tweet);
      }
    }, {
      key: 'update',
      value: function update() {
        var i = 0;
        for (var coord of this.positions) {
          var pos = this.latLongAltToPoint(coord[0], coord[1], coord[2]);

          this.cubes[i].position.copy(pos);
          i++;
        }
        // console.log("yo")
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
