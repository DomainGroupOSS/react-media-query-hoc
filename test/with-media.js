/* eslint-disable */

import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';
import withMedia from '../src/with-media';
import TestComponent from './utils/test-component';

require('jsdom-global')();

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
