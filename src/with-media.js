import PropTypes from 'prop-types';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { MediaContext } from './media-query-provider';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name;
}

const withMedia = (WrappedComponent) => {
  class MediaQueryWrapper extends React.Component {
    render() {
      const { wrappedRef, ...otherProps } = this.props;
      return (
        <MediaContext.Consumer>
          {media => (
            <WrappedComponent {...otherProps} media={media} ref={wrappedRef} />
          )}
        </MediaContext.Consumer>
      );
    }
  }

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
