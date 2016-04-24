
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

    this.tweetEle.addEventListener('mouseover', (e) => {
      var children = this.tweetEle.parentNode.childNodes;
      for (var i in children) {
        var child = children[i];
        if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
          child.overrideOpacity = true;
          child.style.opacity = 0.11;
          console.log(child);
        }
      }
      this.tweetEle.overrideOpacity = true;
      this.tweetEle.style.opacity = 1;
    });

    this.tweetEle.addEventListener('mouseleave', (e) => {
      var children = this.tweetEle.parentNode.childNodes;
      for (var i in children) {
        var child = children[i];
        if (child.classList && child.classList.contains && child.classList.contains("popupDisplay") > 0) {
          child.overrideOpacity = false;
        }
      }
    });

    this.tweetEle.addEventListener('click', (e) => {
      console.log(this);
    });

  }

  destroy() {
    this.tweetEle.parentNode.removeChild(this.tweetEle);
  }

  update() {

    super.updateMatrixWorld()

    var pos3D = this.localToWorld(new THREE.Vector3(0,0,0));

    // pos3D.z += 2;

    var pos = calc3Dto2D(pos3D);
    // console.log(pos);
    this.tweetEle.style.left = Math.floor((pos.x+1)/2*window.innerWidth) + 'px';
    this.tweetEle.style.top = Math.floor(window.innerHeight-Math.floor((pos.y+1)/2*window.innerHeight)) + 'px';
    // this.tweetEle.style.opacity

    var opacity = (10-camera.position.distanceTo(pos3D))/10;
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

  }

};
