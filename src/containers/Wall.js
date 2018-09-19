import * as React from 'react';
import { Home } from 'containers';

class Wall extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Home username={this.props.match.params.username} />
      </React.Fragment>
    );
  }
}

export default Wall;