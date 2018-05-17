import React from 'react';
import PropTypes from 'prop-types';

const TestComponent = ({ media }) => {
  let data = 'Other!';

  if (media.mobile) {
    data = 'Mobile!';
  }

  return <div className="test-component">{data}</div>;
};

TestComponent.propTypes = {
  media: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default TestComponent;
