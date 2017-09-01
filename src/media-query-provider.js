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

  constructor(props) {
    super(props);
    this.state = {
      media: this.queryMedia(props.queries, props.values),
    };
  }

  getChildContext() {
    return this.state;
  }

  componentDidMount() {
    // even if we supplied values for SSR, they may not have matched up with client screen
    // so need to requery with client browser values
    this.clientMatch();

    Object.keys(this.props.queries).forEach((key) => {
      matchMedia(this.props.queries[key], this.props.values).addListener(this.clientMatch);
    });
  }

  componentWillUnmount() {
    Object.keys(this.props.queries).forEach((key) => {
      matchMedia(this.props.queries[key], this.props.values).removeListener(this.clientMatch);
    });
  }

  queryMedia = (queries, values) => {
    return Object.keys(queries).reduce((result, key) => {
      const { matches } = matchMedia(queries[key], values);
      result[key] = matches; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  }

  // check for matches on client mount
  clientMatch = () => {
    const media = this.queryMedia(this.props.queries, {});
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
  values: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

MediaQueryProvider.defaultProps = {
  queries: defaultQueries,
  values: {},
};

export default MediaQueryProvider;
