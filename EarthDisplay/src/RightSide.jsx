
class RightSide extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
          twitter: []
        });

        this.displayName = '';

        console.log('yo');

        events.addEventListener('changeFocus', (event) => {
          this.setState(event.data);
          console.log(event.data);
        });
    }

    render() {
        return <div className="container-fluid">
          <br />
          <h5>Twitter</h5>
          <hr/>
          {
            this.state.twitter.map((tweet) =>
              <div className="panel panel-default" key={tweet.created+tweet.sceenName}>
                <div className="panel-body">
                  <h6>{tweet.name}</h6>
                  <span dangerouslySetInnerHTML={{__html: tweet.text.autoLink()}} />
                </div>
              </div>
            )
          }
          {(() => {
            console.log(this.state.twitter);
            if (this.state.twitter.length == 0) {
              return <p>No tweets found.</p>
            }
          })()}

        </div>;
    }
}

export default RightSide;

