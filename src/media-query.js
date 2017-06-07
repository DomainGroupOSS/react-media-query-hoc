import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import matchMedia from 'matchmedia';
import PropTypes from 'prop-types';

const defaultQueries = {
  mobile: 'screen and (max-width: 623px)',
  tablet: 'screen and (min-width: 624px) and (max-width: 1020px)',
  desktop: 'screen and (min-width: 1021px) and (max-width: 1440px)',
  largeDesktop: 'screen and (min-width: 1441px)',
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name;
}

const makeWrapper = mediaQueryOptions => (WrappedComponent) => {
  const queries = mediaQueryOptions || defaultQueries;

  class MediaQuery extends React.Component {

    constructor() {
      super();

      this.state = {
        media: {},
      };

      this.match = this.match.bind(this);
    }

    getChildContext() {
      return this.state;
    }

    componentDidMount() {
      this.match();

      Object.keys(queries).forEach((key) => {
        matchMedia(queries[key], {}).addListener(this.match);
      });
    }

    componentWillUnmount() {
      Object.keys(queries).forEach((key) => {
        matchMedia(queries[key], {}).removeListener(this.match);
      });
    }

    match() {
      const media = {};

      Object.keys(queries).forEach((key) => {
        const { matches } = matchMedia(queries[key], {});
        media[key] = matches;
      });

      this.setState({ media });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
        />
      );
    }
  }

  MediaQuery.childContextTypes = {
    media: PropTypes.object,
  };

  MediaQuery.displayName = `MediaQuery(${getDisplayName(WrappedComponent)})`;
  return hoistNonReactStatics(MediaQuery, WrappedComponent);
};

export default makeWrapper;