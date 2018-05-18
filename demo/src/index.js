/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import { MediaQueryProvider, withMedia } from 'react-media-query-hoc';

function MediaTable(props) {
  return (
    <table>
      <tbody>
        {Object.entries(props.media).map(([queryName, matches]) => (
          <tr key={Math.random()}>
            <th>{queryName}</th>
            <th>{matches.toString()}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const MediaTableWithMedia = withMedia(MediaTable);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: true,
    };

    this.handleMounting = this.handleMounting.bind(this);
  }

  handleMounting() {
    this.setState({ isMounted: !this.state.isMounted });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isMounted && (
          <MediaQueryProvider>
            <MediaTableWithMedia />
          </MediaQueryProvider>
        )}
        <button onClick={this.handleMounting}>{this.state.isMounted ? 'unmount' : 'mount'}</button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
