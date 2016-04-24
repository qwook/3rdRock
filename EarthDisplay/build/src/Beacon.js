define(['exports', './Loaders.js'], function (exports, _Loaders) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Loaders = _interopRequireWildcard(_Loaders);

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

  var Beacon = function (_THREE$Object3D) {
    _inherits(Beacon, _THREE$Object3D);

    function Beacon() {
      _classCallCheck(this, Beacon);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Beacon).call(this));

      var geometry = new THREE.CylinderGeometry(0.1, 0.2, 5, 6, 6, true);
      var map = Loaders.Texture("images/beacon.png");
      var material = new THREE.MeshBasicMaterial({ map: map, color: 0xffffff, transparent: true, opacity: 0.5 });
      var mesh = new THREE.Mesh(geometry, material);
      _this.add(mesh);
      _this.mesh = mesh;

      var updateListener = function () {
        _this.update();
      };
      global.events.addEventListener('update', updateListener);
      _this.addEventListener('removed', function () {
        global.events.removeEventListener('update', updateListener);
      });
      return _this;
    }

    _createClass(Beacon, [{
      key: 'update',
      value: function update() {
        // this.lookAt(this.worldToLocal(new THREE.Vector3(0,0,0)));

        // console.log(m1);

        // this.updateMatrix();

      }
    }]);

    return Beacon;
  }(THREE.Object3D);

  exports.default = Beacon;
});
//# sourceMappingURL=Beacon.js.map
