
import Tips from './Tips.js';

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

    getGoogle() {
      try {
        return this.state.google.items;
      } catch(e) {
        return [];
      }
    }

    onCurrentLocation() {
      if (this.state.twitter == null && this.state.currentLocation) {
        return true;
      }

      return false;
    }

    render() {
      return <div className="container-fluid">
        {(()=> {
          if (!this.onCurrentLocation()) {
            return <div>
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
                if (this.state.twitter.length == 0) {
                  return <p>No tweets found.</p>
                }
              })()}
              <br />

              <h5>Relevant Articles <small>(Powered by Google)</small></h5>
              <hr />
              {
                this.getGoogle().map((post)=>
                  <div key={post.link} className="panel panel-default"><div className="panel-body"><h6><a href={post.link}><span dangerouslySetInnerHTML={{__html: post.htmlTitle}} /></a></h6><p><span dangerouslySetInnerHTML={{__html: post.htmlSnippet}} /></p></div></div>
                )
              }
              {(() => {
                if (this.getGoogle().length == 0) {
                  return <p>No articles found.</p>
                }
              })()}
            </div>
          } else {
            return <div>
              {(()=>{
                if (this.state.current) {
                  return <div><h4>Current Location</h4><p>Using neural networking, we detected the most likely natural event to happen near you. Here are some tips to prepare for such an event.</p><hr /></div>
                } else {
                  return <br />
                }
              })()}
              <Tips name={this.state.currentLocation} />
            </div>
          }
        })()}

      </div>;
    }
}

export default RightSide;

