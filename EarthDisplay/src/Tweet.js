
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
    beacon.position.z = -3;


    var updateListener = () => {
      this.update();
    };

    global.events.addEventListener('update', updateListener);

    this.addEventListener('removed', () => {
      this.destroy();
      global.events.removeEventListener('update', updateListener);
    })

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
    this.tweetEle.style.top = (window.innerHeight-Math.floor((pos.y+1)/2*window.innerHeight)) + 'px';
    // this.tweetEle.style.opacity

    var opacity = (15-camera.position.distanceTo(pos3D))/15;
    if (opacity < 0) {
      opacity = 0;
    }

    if (opacity > 1) {
      opacity = 1;
    }

    this.tweetEle.style.opacity = opacity;

    this.lookAt(new THREE.Vector3(0,0,0));

  }

};
