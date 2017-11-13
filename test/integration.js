/* eslint-disable */

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import proxyquire from 'proxyquire';
import withMedia from '../src/with-media';
import TestComponent from './utils/test-component';
import MediaQueryProvider from '../src/media-query-provider';
import sinon from 'sinon';

describe('Integration Tests', () => {

  it('should render mobile view with values specified on server', () => {
    const values = {
      width: 300,
      type: 'screen',
    };

    // dont want to do client mount
    const stub = sinon.stub(MediaQueryProvider.prototype, 'componentDidMount').returns('hi!');

    const TestComponentWithMedia = withMedia(TestComponent);
    const component = mount(
      <MediaQueryProvider values={values}>
        <TestComponentWithMedia />
      </MediaQueryProvider>,
    );

    expect(component.find('.test-component').text()).to.equal('Mobile!');

    stub.restore();
  });

  it('should not render mobile view after client / server mismatch', () => {
    const values = {
      width: 300,
      type: 'screen',
    };

    // mock browser media match to have large screen
    const matchMediaMock = require('match-media-mock').create();
    matchMediaMock.setConfig({type: 'screen', width: 1200})

    const MQP = proxyquire('../src/media-query-provider.js', { 'matchmedia': matchMediaMock }).default;

    const TestComponentWithMedia = withMedia(TestComponent);
    const component = mount(
      <MQP values={values}>
        <TestComponentWithMedia />
      </MQP>,
    );

    expect(component.find('.test-component').text()).to.equal('Other!');
  });

});
