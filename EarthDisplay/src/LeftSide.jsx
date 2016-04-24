
class LeftSide extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
        });

        events.addEventListener('changeFocus', (event) => {
          this.setState(event.data);
          console.log(event.data);
          try {
            console.log(this.state.watson[0].document_tone.tone_categories[0].tones);
          } catch(e) {}
        });
    }

    getNasaImage() {
      console.log(this);
      console.log(this.state);
      if (!this.state.coords) {
        return "";
      }

      // var n = Math.pow(2, 4);
      // var lat_rad = this.state.coords.lat / 180 * Math.PI;
      // var xtile = Math.floor(n * ((this.state.coords.long + 180) / 360)
      // var ytile = Math.floor(n * (1 - (Math.log(Math.tan(lat_rad) + 1/Math.cos(lat_rad)) / Math.PI)) / 2);

        // mx, my = self.LatLonToMeters(lat, lng)
        // tx, ty = self.MetersToTile(mx, my, zoom)
        // return self.GoogleTile(tx, ty, zoom)


      var zoom = 5;
      var originShift = 2 * Math.PI * 6378137 / 2.0;
      // var originShift = 0;

      var mx = this.state.coords.long * originShift / 180.0;
      var my = Math.log( Math.tan((90 + this.state.coords.lat) * Math.PI / 360.0 )) / (Math.PI / 180.0);
      my = my * originShift / 180.0;

      var res = (2 * Math.PI * 6378137) / (256 * Math.pow(2,zoom));
      var px = (mx + originShift) / res;
      var py = (my + originShift) / res;

      var tx = Math.floor( Math.ceil( px / 256 ) - 1 );
      var ty = Math.floor( Math.ceil( py / 256 ) - 1 );
      ty = (Math.pow(2,zoom) - 1) - ty;

      return "http://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default/2016-04-23/GoogleMapsCompatible_Level9/" + zoom + "/" + ty + "/" + tx + ".jpeg";
    }

    getWatson() {
      var tones = {};

      try {
        var _tones = this.state.watson[0].document_tone.tone_categories[0].tones;
        for (var tone of _tones) {
          tones[tone.tone_id] = tone.score;
        }
      } catch(e) {
        return null;
      }

      return tones;
    }

    getWeather() {
      // this.state.weather.metadata.
    }

    render() {
        return <div className="container-fluid">
          <h1>Jiho</h1>
          <p>{this.state.title}</p>
          <img src={this.getNasaImage()} />
          <hr/>

          <h5>Weather</h5>
          <p>N/A</p>

          <h5>Mood</h5>
          {(()=>{
            var watson = this.getWatson();
            if (watson) {
              return <div>
                <div className="progress">
                  <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow={Math.floor(watson.anger*100)} aria-valuemin="0" aria-valuemax="100" style={{minWidth: "2em", width: watson.anger*100 + "%"}}>
                    Anger {Math.floor(watson.anger*100)}%
                  </div>
                </div>
                <div className="progress">
                  <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow={Math.floor(watson.disgust*100)} aria-valuemin="0" aria-valuemax="100" style={{minWidth: "2em", width: watson.disgust*100 + "%"}}>
                    Disgust {Math.floor(watson.disgust*100)}%
                  </div>
                </div>
                <div className="progress">
                  <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow={Math.floor(watson.fear*100)} aria-valuemin="0" aria-valuemax="100" style={{minWidth: "2em", width: watson.fear*100 + "%"}}>
                    Fear {Math.floor(watson.fear*100)}%
                  </div>
                </div>
                <div className="progress">
                  <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={Math.floor(watson.joy*100)} aria-valuemin="0" aria-valuemax="100" style={{minWidth: "2em", width: watson.joy*100 + "%"}}>
                    Joy {Math.floor(watson.joy*100)}%
                  </div>
                </div>
                <div className="progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow={Math.floor(watson.sadness*100)} aria-valuemin="0" aria-valuemax="100" style={{minWidth: "2em", width: watson.sadness*100 + "%"}}>
                    Sadness {Math.floor(watson.sadness*100)}%
                  </div>
                </div>
              </div>
            }
          })()}

          <p>Made by Aris Koumis and Henry Tran. You made this? Oh. We made this.</p>
        </div>;
    }
}

export default LeftSide;
