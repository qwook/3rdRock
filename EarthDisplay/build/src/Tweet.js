define(["exports", "./Beacon.js"], function (exports, _Beacon) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Beacon2 = _interopRequireDefault(_Beacon);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

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

  var canvasWrapper = document.getElementById("canvasWrapper");

  var Tweet = function (_THREE$Object3D) {
    _inherits(Tweet, _THREE$Object3D);

    function Tweet(data) {
      _classCallCheck(this, Tweet);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tweet).call(this));

      var tweetEle = document.createElement("div");
      tweetEle.className = "popupDisplay tweet";
      tweetEle.textContent = data.message;
      tweetEle.style.top = "0px";
      tweetEle.style.left = "0px";
      _this.tweetEle = tweetEle;

      canvasWrapper.appendChild(tweetEle);

      // var geometry = new THREE.SphereGeometry(0.5, 5, 5);
      // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      // var cube = new THREE.Mesh( geometry, material );
      // this.add( cube );

      var beacon = new _Beacon2.default();
      _this.add(beacon);
      beacon.rotation.x = -Math.PI / 2;
      beacon.position.z = -3;

      var updateListener = function () {
        _this.update();
      };

      global.events.addEventListener('update', updateListener);

      _this.addEventListener('removed', function () {
        _this.destroy();
        global.events.removeEventListener('update', updateListener);
      });

      return _this;
    }

    _createClass(Tweet, [{
      key: "destroy",
      value: function destroy() {
        this.tweetEle.parentNode.removeChild(this.tweetEle);
      }
    }, {
      key: "update",
      value: function update() {

        _get(Object.getPrototypeOf(Tweet.prototype), "updateMatrixWorld", this).call(this);

        var pos3D = this.localToWorld(new THREE.Vector3(0, 0, 0));

        // pos3D.z += 2;

        var pos = calc3Dto2D(pos3D);
        // console.log(pos);
        this.tweetEle.style.left = Math.floor((pos.x + 1) / 2 * window.innerWidth) + 'px';
        this.tweetEle.style.top = window.innerHeight - Math.floor((pos.y + 1) / 2 * window.innerHeight) + 'px';
        // this.tweetEle.style.opacity

        var opacity = (15 - camera.position.distanceTo(pos3D)) / 15;
        if (opacity < 0) {
          opacity = 0;
        }

        if (opacity > 1) {
          opacity = 1;
        }

        this.tweetEle.style.opacity = opacity;

        this.lookAt(new THREE.Vector3(0, 0, 0));
      }
    }]);

    return Tweet;
  }(THREE.Object3D);

  exports.default = Tweet;
  ;
});
//# sourceMappingURL=Tweet.js.map
