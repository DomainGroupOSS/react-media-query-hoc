import React from 'react';
import { expect } from 'chai';
import { render, mount } from 'enzyme';
import getMatchMediaMock from './utils/get-match-media-mock';
import withMedia from '../src/with-media';
import TestComponent from './utils/test-component';
import MediaQueryProvider from '../src/media-query-provider';

describe('Integration Tests', () => {
  before(() => {
    // mock browser media match to have large screen
    const matchMediaMock = getMatchMediaMock({ type: 'screen', width: 1200 });
    window.matchMedia = matchMediaMock.matchMedia;
  });

  after(() => {
    delete window.matchMedia;
  });

  it('should render using values on the first render pass', () => {
    const values = {
      width: 300,
      type: 'screen',
    };

    const TestComponentWithMedia = withMedia(TestComponent);
    const component =
      render(
        <MediaQueryProvider values={values}>
          <TestComponentWithMedia />
        </MediaQueryProvider>,
      );

    expect(component.find('.test-component').text()).to.equal('Mobile!');
  });

  it('should not render mobile view after client/server mismatch is figured out in componentDidMount', () => {
    const values = {
      width: 300,
      type: 'screen',
    };

    const TestComponentWithMedia = withMedia(TestComponent);
    const component =
      mount(
        <MediaQueryProvider values={values}>
          <TestComponentWithMedia />
        </MediaQueryProvider>,
      );

    expect(component.find('.test-component').text()).to.equal('Other!');
  });
});
