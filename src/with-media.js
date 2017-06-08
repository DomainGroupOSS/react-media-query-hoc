import PropTypes from 'prop-types';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name;
}

const withMedia = (WrappedComponent) => {
  class MediaQueryWrapper extends React.Component {
    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          media={this.context.media}
        />
      );
    }
  }

  MediaQueryWrapper.contextTypes = {
    media: PropTypes.object,
  };

  MediaQueryWrapper.displayName = `MediaQuery(${getDisplayName(WrappedComponent)})`;
  return hoistNonReactStatics(MediaQueryWrapper, WrappedComponent);
};

export default withMedia;
