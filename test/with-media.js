/* eslint-disable */

import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import withMedia from '../src/with-media';

require('jsdom-global')();


const TestComponent = ({ media }) => {
  if (media.mobile) {
    return (
      <div>
        Mobile!
      </div>
    );
  }

  return (
    <div>
      Other!
    </div>
  );
};

TestComponent.propTypes = {
  media: PropTypes.object.isRequired,
};

const testContext = {
  context: {
    media: {
      mobile: true,
    },
  },
};

describe('<withMedia />', () => {
  const TestComponentWithMedia = withMedia(TestComponent);
  let component;

  it('should render with HOC', () => {
    expect(() => {
      component = mount(<TestComponentWithMedia />, testContext);
    }).toNotThrow();
  });

  it('should render mobile view', () => {
    component = mount(<TestComponentWithMedia />, testContext);
    expect(component.text()).toEqual('Mobile!');
  });

  it('should render other view', () => {
    const otherContext = {
      context: {
        media: {
          mobile: false,
        },
      },
    };

    component = mount(<TestComponentWithMedia />, otherContext);
    expect(component.text()).toEqual('Other!');
  });
});
