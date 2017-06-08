import React from 'react';
import matchMedia from 'matchmedia';
import PropTypes from 'prop-types';

const defaultQueries = {
  mobile: 'screen and (max-width: 623px)',
  tablet: 'screen and (min-width: 624px) and (max-width: 1020px)',
  desktop: 'screen and (min-width: 1021px) and (max-width: 1440px)',
  largeDesktop: 'screen and (min-width: 1441px)',
};

class MediaQueryProvider extends React.Component {

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

    Object.keys(this.props.queries).forEach((key) => {
      matchMedia(this.props.queries[key], {}).addListener(this.match);
    });
  }

  componentWillUnmount() {
    Object.keys(this.props.queries).forEach((key) => {
      matchMedia(this.props.queries[key], {}).removeListener(this.match);
    });
  }

  match() {
    const media = {};

    Object.keys(this.props.queries).forEach((key) => {
      const { matches } = matchMedia(this.props.queries[key], {});
      media[key] = matches;
    });

    this.setState({ media });
  }

  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

MediaQueryProvider.childContextTypes = {
  media: PropTypes.object,
};

MediaQueryProvider.propTypes = {
  queries: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.node.isRequired,
};

MediaQueryProvider.defaultProps = {
  queries: defaultQueries,
};

export default MediaQueryProvider;
