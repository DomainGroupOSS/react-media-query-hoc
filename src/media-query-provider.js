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
      media: this.queryMedia(props),
    };
  }

  getChildContext() {
    return this.state;
  }

  componentDidMount() {
    this.match();

    Object.keys(this.props.queries).forEach((key) => {
      matchMedia(this.props.queries[key], this.props.values).addListener(this.match);
    });
  }

  componentWillUnmount() {
    Object.keys(this.props.queries).forEach((key) => {
      matchMedia(this.props.queries[key], this.props.values).removeListener(this.match);
    });
  }

  queryMedia = (props) => {
    return Object.keys(props.queries).reduce((result, key) => {
      const { matches } = matchMedia(props.queries[key], props.values);
      result[key] = matches; // eslint-disable-line no-param-reassign
      return result;
    }, {});
  }

  match = () => {
    const media = this.queryMedia(this.props);
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
