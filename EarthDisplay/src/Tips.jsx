
import CategoryColors from './CategoryColors.js';

class Tips extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    getIcon(cat) {
      return CategoryColors.categories[cat].icon
    }

    render() {
        return <div>
          {(()=>{
            if (this.props.name == "Temperature Extremes") {
              return <div>
                <img src={this.getIcon(this.props.name)} style={{display: 'inlineBlock', height: '32px'}}/>
                <h4>Temperature Extremes</h4>
                <p>Yo</p>
              </div>
            }
          })()}
        </div>;
    }
}

export default Tips;

