import React from 'react';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
import cssMediaQuery from 'css-mediaquery';

const isServer = typeof process !== 'undefined';

class MediaQueryProvider extends React.Component {
  constructor(props) {
    super(props);

    let media;

    if (this.props.values) {
      media = Object.entries(this.props.queries).reduce((acc, [queryName, query]) => {
        // see README.md's "React 16 ReactDOM.hydrate" for info on why we use staticMatch
        // even in the browser
        acc[queryName] = cssMediaQuery.match(query, this.props.values);
        return acc;
      }, {});
    } else {
      media = Object.entries(this.props.queries).reduce((acc, [queryName, query]) => {
        // if the user has not set `values` and is server rendering, default to false
        // because we don't know the screen size
        acc[queryName] = isServer ? false : window.matchMedia(query).matches;
        return acc;
      }, {});
    }

    // this is for the mediaQueryListener to be able to find the queryName from it's event arg
    this.reverseQueries = Object.entries(this.props.queries).reduce((acc, [queryName, query]) => {
      acc[query] = queryName;
      return acc;
    }, {});

    this.mediaQueryListInstanceArray = [];

    this.state = {
      media,
    };

    this.mediaQueryListener = this.mediaQueryListener.bind(this);
  }

  getChildContext() {
    return this.state;
  }

  componentDidMount() {
    const media = Object.entries(this.props.queries).reduce((acc, [queryName, query]) => {
      const mediaQueryListInstance = window.matchMedia(query);

      mediaQueryListInstance.addListener(this.mediaQueryListener);

      this.mediaQueryListInstanceArray.push(mediaQueryListInstance);

      acc[queryName] = mediaQueryListInstance.matches;
      return acc;
    }, {});

    if (!shallowequal(media, this.state.media)) {
      this.setState({ media }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  componentWillUnmount() {
    this.mediaQueryListInstanceArray.forEach((mediaQueryListInstance) => {
      mediaQueryListInstance.removeListener(this.mediaQueryListener);
    });
  }

  mediaQueryListener({ matches, media }) {
    const queryName = this.reverseQueries[media];
    const newMedia = {
      ...this.state.media,
      [queryName]: matches,
    };

    if (!shallowequal(newMedia, this.state.media)) {
      this.setState({ media: newMedia });
    }
  }

  render() {
    if (React.Fragment) {
      return <React.Fragment>{this.props.children}</React.Fragment>;
    }

    if (React.Children.count(this.props.children) > 1) {
      return <div>{this.props.children}</div>;
    }

    return this.props.children;
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
