import React from 'react';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
// this is for server side rendering and does not use window.matchMedia
import cssMediaQuery from 'css-mediaquery';

const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

class MediaQueryProvider extends React.Component {
  constructor(props) {
    super(props);

    this.media = {};

    const media = Object.keys(this.props.queries).reduce((acc, queryName) => {
      const query = this.props.queries[queryName];

      if (this.props.values) {
        acc[queryName] = cssMediaQuery.match(query, this.props.values);
      } else {
        // if the consumer has not set `values` and is server rendering, default to false
        // because we don't know the screen size
        acc[queryName] = hasMatchMedia ? window.matchMedia(query).matches : false;
      }

      return acc;
    }, {});

    this.mediaQueryListInstanceMap = new Map();

    this.media = media;

    this.state = {
      media,
    };

    this.mediaQueryListener = this.mediaQueryListener.bind(this);
  }

  getChildContext() {
    return this.state;
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
      this.media = media;
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        media: { ...this.media },
      });
    }
  }

  componentWillUnmount() {
    this.mediaQueryListInstanceMap.forEach(mediaQueryList =>
      mediaQueryList.query.removeListener(this.mediaQueryListener));
  }

  mediaQueryListener({ matches, media }) {
    const { queryName } = this.mediaQueryListInstanceMap.get(media);
    this.media[queryName] = matches;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // using setTimeout with 0ms to push the state change to the end of the event loop.
    // This fixes an issue where we get multiple and inconsistent re-renders happening
    // on resize due to the state changes from two breakpoints firing one after the other
    // by preventing the first event from making it to state, and only taking the last event.
    this.timer = setTimeout(() => {
      this.timer = null;
      this.setState({
        media: { ...this.media },
      });
    }, 0);
  }

  render() {
    if (React.Fragment) {
      return <React.Fragment>{this.props.children}</React.Fragment>;
    }

    if (React.Children.count(this.props.children) === 1) {
      return this.props.children;
    }

    return <div>{this.props.children}</div>;
  }
}

MediaQueryProvider.childContextTypes = {
  media: PropTypes.object,
};

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

export default MediaQueryProvider;
