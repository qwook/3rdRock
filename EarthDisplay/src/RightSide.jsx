
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

    getTweets() {
      var tweets = [];
      for (var tweet of this.state.twitter) {
        if (tweet.text.substring(0,4) != "RT @") {
          tweets.push(tweet);
        }
      }
      return tweets;
    }

    getAlchemy() {
      var alchemy = [];
      try {
        for (var post of this.state.alchemy[0].result.docs) {
          try {
            post.source.enriched.url.id = post.id;
            alchemy.push(post.source.enriched.url);
          } catch(e) {}
        }
      } catch(e) {}
      return alchemy;
    }

    render() {
        return <div className="container-fluid">
          <br />
          <h5>Twitter</h5>
          <hr/>
          {
            this.getTweets().map((tweet) =>
              <div className="panel panel-default" key={tweet.created+tweet.sceenName}>
                <div className="panel-body">
                  <h6><img src={tweet.userPicture} width="25px;" />&nbsp;&nbsp;{tweet.name}</h6>
                  <span dangerouslySetInnerHTML={{__html: tweet.text.autoLink()}} />
                  {(() => {
                    console.log(tweet);
                    if (tweet.media) {
                      return <div><hr/><img src={tweet.media} style={{"maxWidth": "100%"}} /></div>;
                    }
                  })()}
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
          <br />
          <h5>Relevant Articles <small>(Powered by Alchemy)</small></h5>
          <hr />
          {
            this.getAlchemy().map((post)=>
              <div key={post.id} className="panel panel-default"><a href={post.url}><div className="panel-body"><h6>{post.title}</h6></div></a></div>
            )
          }

        </div>;
    }
}

export default RightSide;

