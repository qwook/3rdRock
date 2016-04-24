
class BottomSide extends React.Component {
  constructor(props) {
    super(props);

    this.displayName = '';
  }

  componentWillMount() {

    this.setState({
      current: "standard"
    });

  }

  render() {
      return <div className="container-fluid">
        <div className="btn-group">
          <a className={"btn " + this.is('standard')} onClick={() => this.clickStandard()}>Standard View</a>
          <a className={"btn " + this.is('satellite')} onClick={() => this.clickSatellite()}>Satellite View</a>
        </div>
        <div style={{'display': 'inlineBlock', 'float': 'right'}}>
          Powered by EONET
        </div>
      </div>;
  }

  is(type) {
    console.log(type);
    console.log(this.state);
    if (type == this.state.current) {
      return 'btn-primary';
    } else {
      return 'btn-default';
    }
  }

  clickStandard() {
    earth.current = "standard";
    this.setState({
      current: "standard"
    });
  }

  clickSatellite() {
    earth.current = "satellite";
    this.setState({
      current: "satellite"
    });
    console.log("satellite");
    console.log(this.state);
  }
}

export default BottomSide;

