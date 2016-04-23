
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


    var geometry = new THREE.SphereGeometry(0.5, 5, 5);
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    this.add( cube );


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
    this.tweetEle.style.left = Math.floor((pos.x+1)/2*500) + 'px';
    this.tweetEle.style.top = (500-Math.floor((pos.y+1)/2*500)) + 'px';
    // this.tweetEle.style.opacity

    var opacity = (25-camera.position.distanceTo(pos3D))/25;
    if (opacity < 0) {
      opacity = 0;
    }

    if (opacity > 1) {
      opacity = 1;
    }

    console.log(camera.position.distanceTo(pos3D));

    this.tweetEle.style.opacity = opacity;

  }

};
