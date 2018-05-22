import PropTypes from 'prop-types';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name;
}

const withMedia = (WrappedComponent) => {
  class MediaQueryWrapper extends React.Component {
    render() {
      const { wrappedRef, ...otherProps } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          media={this.context.media}
          ref={wrappedRef}
        />
      );
    }
  }

  MediaQueryWrapper.contextTypes = {
    media: PropTypes.object,
  };

  MediaQueryWrapper.propTypes = {
    wrappedRef: PropTypes.func,
  };

  MediaQueryWrapper.defaultProps = {
    wrappedRef: undefined,
  };

  MediaQueryWrapper.displayName = `withMedia(${getDisplayName(WrappedComponent)})`;

  return hoistNonReactStatics(MediaQueryWrapper, WrappedComponent);
};

export default withMedia;
