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

  var leftSide = document.getElementById("leftSide");
  var rightSide = document.getElementById("rightSide");
  var biggieSmalls = document.getElementById("biggieSmalls");

  var Tweet = function (_THREE$Object3D) {
    _inherits(Tweet, _THREE$Object3D);

    function Tweet(data) {
      _classCallCheck(this, Tweet);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tweet).call(this));

      _this.data = data;

      var tweetEle = document.createElement("div");
      tweetEle.className = "popupDisplay tweet";
      tweetEle.textContent = data.title;
      tweetEle.style.top = "0px";
      tweetEle.style.left = "0px";
      _this.tweetEle = tweetEle;

      canvasWrapper.appendChild(tweetEle);

      var beacon = new _Beacon2.default();
      _this.add(beacon);
      beacon.rotation.x = -Math.PI / 2;
      beacon.position.z = -2.5;
      _this.beacon = beacon;

      var updateListener = function () {
        _this.update();
      };

      global.events.addEventListener('update', updateListener);

      _this.addEventListener('removed', function () {
        _this.destroy();
        global.events.removeEventListener('update', updateListener);
      });

      _this.hovering = false;

      _this.tweetEle.addEventListener('mouseover', function (e) {
        _this.startHover();
      });

      _this.tweetEle.addEventListener('mouseleave', function (e) {
        _this.stopHover();
      });

      _this.hoverTime = 0;

      _this.isGoing = false;

      _this.tweetEle.addEventListener('click', function (e) {
        _this.onClick();
      });

      return _this;
    }

    _createClass(Tweet, [{
      key: "startHover",
      value: function startHover() {
        var children = this.tweetEle.parentNode.childNodes;
        for (var i in children) {
          var child = children[i];
          if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
            child.overrideOpacity = true;
            child.style.opacity = 0.11;
          }
        }
        this.tweetEle.overrideOpacity = true;
        this.tweetEle.style.opacity = 1;
        this.beacon.mesh.material.opacity = 1;
        this.hovering = true;
      }
    }, {
      key: "stopHover",
      value: function stopHover() {
        var children = this.tweetEle.parentNode.childNodes;
        for (var i in children) {
          var child = children[i];
          if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
            child.overrideOpacity = false;
          }
        }
        this.beacon.mesh.material.opacity = 0.5;
        this.hovering = false;
      }
    }, {
      key: "onClick",
      value: function onClick() {
        leftSide.className = "";
        rightSide.className = "";
        biggieSmalls.className = "";
        leftSide.scrollTop = 0;
        rightSide.scrollTop = 0;
        biggieSmalls.scrollTop = 0;

        var lol = new THREE.Vector3(0, 0, 0);
        this.localToWorld(lol);
        // camera.position.copy( lol );

        this.goal = lol.multiplyScalar(1.2);
        this.isGoing = true;
        controls.enabled = false;
        controls.locking = true;

        events.dispatchEvent({ type: 'changeFocus', data: this.data });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.tweetEle.parentNode.removeChild(this.tweetEle);
      }
    }, {
      key: "update",
      value: function update() {

        if (this.isGoing) {
          camera.position.lerp(this.goal, 0.1);
          if (camera.position.distanceTo(this.goal) < 0.1) {
            this.isGoing = false;
            controls.enabled = true;
            setTimeout(function () {
              controls.locking = false;
            }, 1);
          }
        }

        var pos3D = this.localToWorld(new THREE.Vector3(0, 0, 0));

        // pos3D.z += 2;

        var pos = calc3Dto2D(pos3D);
        // console.log(pos);
        this.tweetEle.style.left = Math.floor((pos.x + 1) / 2 * window.innerWidth) + 'px';
        this.tweetEle.style.top = Math.floor(window.innerHeight - Math.floor((pos.y + 1) / 2 * window.innerHeight)) + 'px';
        // this.tweetEle.style.opacity

        if (!this.tweetEle.overrideOpacity) {
          var dist = camera.position.length() / 2;
          var opacity = (dist - camera.position.distanceTo(pos3D)) / dist;
          if (opacity < 0) {
            opacity = 0;
            this.tweetEle.style.display = 'none';
          } else {
            this.tweetEle.style.display = 'inline-block';
          }

          if (opacity > 1) {
            opacity = 1;
          }

          this.tweetEle.style.opacity = opacity;
        }

        if (this.tweetEle.style.opacity <= 0) {
          this.tweetEle.style.opacity = 0;
          this.tweetEle.style.display = 'none';
        } else {
          if (this.hovering) {
            this.tweetEle.style.display = 'inline-block';
          }
        }

        this.lookAt(new THREE.Vector3(0, 0, 0));
      }
    }]);

    return Tweet;
  }(THREE.Object3D);

  exports.default = Tweet;
  ;
});
//# sourceMappingURL=Tweet.js.map
