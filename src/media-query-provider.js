import React from 'react';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
// this is for server side rendering and does not use window.matchMedia
import cssMediaQuery from 'css-mediaquery';

import { debounce } from './utils';

const hasMatchMedia =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const MediaContext = React.createContext({});

class MediaQueryProvider extends React.Component {
  constructor(props) {
    super(props);

    const media = Object.keys(this.props.queries).reduce((acc, queryName) => {
      const query = this.props.queries[queryName];

      if (this.props.values) {
        acc[queryName] = cssMediaQuery.match(query, this.props.values);
      } else {
        // if the consumer has not set `values` and is server rendering, default to false
        // because we don't know the screen size
        acc[queryName] = hasMatchMedia
          ? window.matchMedia(query).matches
          : false;
      }

      return acc;
    }, {});

    this.mediaQueryListInstanceMap = new Map();

    this.state = {
      media,
    };

    this.mediaQueryListener = this.mediaQueryListener.bind(this);

    this.currentMediaState = this.state.media;
    this.updateState = debounce((newMedia) => {
      if (!shallowequal(newMedia, this.state.media)) {
        this.setState({ media: newMedia });
      }
    }, 20);
  }

  componentDidMount() {
    const media = Object.keys(this.props.queries).reduce((acc, queryName) => {
      const mediaQueryListInstance = window.matchMedia(this.props.queries[queryName]);

      mediaQueryListInstance.addListener(this.mediaQueryListener);

      // this is so we can keep a reference to the MediaQueryList for removing the listener
      // and knowing the queryName in `mediaQueryListener`
      this.mediaQueryListInstanceMap.set(mediaQueryListInstance.media, {
        query: mediaQueryListInstance,
        queryName,
      });

      acc[queryName] = mediaQueryListInstance.matches;
      return acc;
    }, {});

    // need to rerender with correct media if it didnt match up with initial
    if (!shallowequal(media, this.state.media)) {
      this.setState({ media }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  componentWillUnmount() {
    this.mediaQueryListInstanceMap.forEach(mediaQueryList =>
      mediaQueryList.query.removeListener(this.mediaQueryListener));
  }

  mediaQueryListener({ matches, media }) {
    const { queryName } = this.mediaQueryListInstanceMap.get(media);
    this.currentMediaState = {
      ...this.currentMediaState,
      [queryName]: matches,
    };
    this.updateState(this.currentMediaState);
  }

  children() {
    if (React.Fragment) {
      return <React.Fragment>{this.props.children}</React.Fragment>;
    }

    if (React.Children.count(this.props.children) === 1) {
      return this.props.children;
    }

    return <div>{this.props.children}</div>;
  }

  render() {
    return (
      <MediaContext.Provider value={this.state.media}>
        {this.children()}
      </MediaContext.Provider>
    );
  }
}

MediaQueryProvider.propTypes = {
  children: PropTypes.node.isRequired,
  queries: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  values: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

MediaQueryProvider.defaultProps = {
  queries: {
    mobile: 'screen and (max-width: 623px)',
    tablet: 'screen and (min-width: 624px) and (max-width: 1020px)',
    desktop: 'screen and (min-width: 1021px) and (max-width: 1440px)',
    largeDesktop: 'screen and (min-width: 1441px)',
  },
  values: {},
};

export { MediaContext };
export default MediaQueryProvider;
