/* eslint-disable react/prop-types */
const React = require('react');
const Mobile = require('./Mobile');
const Desktop = require('./Desktop');
const Tablet = require('./Tablet');
const { MediaQueryProvider, withMedia } = require('../../');

function MediaItem(props) {
  if (props.media.mobile) {
    return (
      <Mobile />
    );
  } else if (props.media.tablet) {
    return (
      <Tablet />
    );
  }

  return (
    <Desktop />
  );
}

const MediaItemWithMedia = withMedia(MediaItem);

module.exports = class App extends React.Component {
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
          <MediaQueryProvider values={this.props.values}>
            <MediaItemWithMedia />
          </MediaQueryProvider>
        )}
        <button onClick={this.handleMounting}>{this.state.isMounted ? 'unmount' : 'mount'}</button>
      </React.Fragment>
    );
  }
};
