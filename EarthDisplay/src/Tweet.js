
import Beacon from './Beacon.js';

const canvasWrapper = document.getElementById("canvasWrapper");

export default class Tweet extends THREE.Object3D {

  constructor(data) {
    super();

    var tweetEle = document.createElement("div");
    tweetEle.className = "popupDisplay tweet";
    tweetEle.textContent = data.message;
    tweetEle.style.top = "0px";
    tweetEle.style.left = "0px";
    this.tweetEle = tweetEle;

    canvasWrapper.appendChild(tweetEle);

    this.tweetBlocks = [];

    var tweetBlockHolder = document.createElement("div");
    tweetBlockHolder.className = ".tweetBlockHolder";
    this.tweetEle.appendChild(tweetBlockHolder);

    for (var tweet of data.tweets) {
      var tweetBlockEle = document.createElement("div");
      tweetBlockEle.className = "popunderDisplay tweetBlock tweet";
      tweetBlockEle.style.bottom = "0px";
      tweetBlockEle.style.left = "0px";
      tweetBlockEle.textContent = tweet.text;
      tweetBlockHolder.appendChild(tweetBlockEle);
      this.tweetBlocks.push(tweetBlockEle);
    }


    // var geometry = new THREE.SphereGeometry(0.5, 5, 5);
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube = new THREE.Mesh( geometry, material );
    // this.add( cube );

    var beacon = new Beacon();
    this.add(beacon);
    beacon.rotation.x = -Math.PI/2;
    beacon.position.z = -2.5;


    var updateListener = () => {
      this.update();
    };

    global.events.addEventListener('update', updateListener);

    this.addEventListener('removed', () => {
      this.destroy();
      global.events.removeEventListener('update', updateListener);
    })

    this.hovering = false;

    this.tweetEle.addEventListener('mouseover', (e) => {
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

      this.hovering = true;
      this.lastCurrent = -1;

      for (var i in this.tweetBlocks) {
        var tweetBlock = this.tweetBlocks[i];
        $(tweetBlock).off('transitionend');
      }
    });

    this.tweetEle.addEventListener('mouseleave', (e) => {
      if (this.isGoing) {
        return;
      }

      var children = this.tweetEle.parentNode.childNodes;
      for (var i in children) {
        var child = children[i];
        if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
          child.overrideOpacity = false;
        }
      }

      for (var i in this.tweetBlocks) {
        var tweetBlock = this.tweetBlocks[i];
        // tweetBlock.style.display = 'none';
        tweetBlock.style.bottom = 0 + "px";
        tweetBlock.style.left = 0 + "px";
        $(tweetBlock).one('transitionend', (function(e) {
          this.style.display = 'none';
        }).bind(tweetBlock));
        console.log("OPACITYZERO");
        tweetBlock.style.opacity = '0';
      }

      this.hovering = false;
    });

    this.hoverTime = 0;

    this.isGoing = false;

    this.tweetEle.addEventListener('click', (e) => {
      var lol = new THREE.Vector3(0,0,0);
      this.localToWorld(lol);
      // camera.position.copy( lol );

      this.goal = lol.multiplyScalar(1.2);
      this.isGoing = true;
      controls.enabled = false;
    });

  }

  destroy() {
    this.tweetEle.parentNode.removeChild(this.tweetEle);
  }

  update() {

    if (this.isGoing) {
      camera.position.lerp(this.goal, 0.05);
      if ( camera.position.distanceTo(this.goal) < 0.1 ) {
        this.isGoing = false;
        controls.enabled = true;
      }
    }


    var pos3D = this.localToWorld(new THREE.Vector3(0,0,0));

    // pos3D.z += 2;

    var pos = calc3Dto2D(pos3D);
    // console.log(pos);
    this.tweetEle.style.left = Math.floor((pos.x+1)/2*window.innerWidth) + 'px';
    this.tweetEle.style.top = Math.floor(window.innerHeight-Math.floor((pos.y+1)/2*window.innerHeight)) + 'px';
    // this.tweetEle.style.opacity

    var dist = camera.position.length()/2;
    var opacity = (dist-camera.position.distanceTo(pos3D))/dist;
    if (opacity < 0) {
      opacity = 0;
      this.tweetEle.style.display = 'none';
    } else {
      this.tweetEle.style.display = 'inline-block';
    }

    if (opacity > 1) {
      opacity = 1;
    }

    if (!this.tweetEle.overrideOpacity) {
      this.tweetEle.style.opacity = opacity;
    }

    this.lookAt(new THREE.Vector3(0,0,0));

    if (this.hovering || this.isGoing) {
      if (this.tweetBlocks.length == 0) { return; }

      // this.hoverTime += deltaTime;
      // var current = Math.floor((this.hoverTime / 3000)) % Math.ceil(this.tweetBlocks.length);
      var current = 0;
      if (current != this.lastCurrent) {
        for (var i in this.tweetBlocks) {
          var tweetBlock = this.tweetBlocks[i];
          if (i == current) {
            var j = i;
            console.log("hey" + j);
            setTimeout((function() {
              console.log(this);
              this.style.bottom = -150 + "px";
              this.style.left = 250 + "px";
              this.style.width = "200px";
              this.style.opacity = 1;
              console.log(tweetBlock);
            }).bind(tweetBlock), 10);
            tweetBlock.style.display = 'block';
          } else if (i == (current + 1)%this.tweetBlocks.length) {
            var j = i;
            console.log("hey" + j);
            setTimeout((function() {
              console.log(this);
              this.style.bottom = -150 + "px";
              this.style.left = 0 + "px";
              this.style.width = "200px";
              this.style.opacity = 1;
              console.log(tweetBlock);
            }).bind(tweetBlock), 10);
            tweetBlock.style.display = 'block';
          } else if (i == (current + 2)%this.tweetBlocks.length) {
            var j = i;
            console.log("hey" + j);
            setTimeout((function() {
              console.log(this);
              this.style.bottom = -150 + "px";
              this.style.left = -250 + "px";
              this.style.width = "200px";
              this.style.opacity = 1;
              console.log(tweetBlock);
            }).bind(tweetBlock), 10);
            tweetBlock.style.display = 'block';
          } else {
            tweetBlock.style.bottom = -150 + "px";
            tweetBlock.style.left = 0 + "px";
            console.log("OPACITYZERO");
            tweetBlock.style.opacity = 0;
          }
        }
      }
      this.lastCurrent = current;
    }

  }

};
