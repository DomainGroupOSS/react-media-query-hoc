import React from 'react';
import PropTypes from 'prop-types';

// must be a React.Component, stateless functions can not be given refs https://github.com/facebook/react/issues/10831
class TestComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let data = 'Other!';

    if (this.props.media.mobile) {
      data = 'Mobile!';
    }

    return (
      <section>
        <p className="test-component">{data}</p>
      </section>
    );
  }
}

TestComponent.propTypes = {
  media: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default TestComponent;
