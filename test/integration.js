/* eslint-disable */

import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';
import withMedia from '../src/with-media';
import TestComponent from './utils/test-component';
import MediaQueryProvider from '../src/media-query-provider';

require('jsdom-global')();

describe('Integration', () => {
  it('should render mobile view with values specified', () => {
    const values = {
      width: 300,
      type: 'screen',
    };

    const TestComponentWithMedia = withMedia(TestComponent);
    const component = mount(
      <MediaQueryProvider values={values}>
        <TestComponentWithMedia />
      </MediaQueryProvider>,
    );

    expect(component.find('.test-component').text()).toEqual('Mobile!');
  });
});
