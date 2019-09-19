import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MediaQueryProvider, { MediaContext } from '../src/media-query-provider';
import getMatchMediaMock from './utils/get-match-media-mock';


function TestComponentWithContext() {
  return (
    <MediaContext.Consumer>
      {
        media => (<span><p className="test-component">{media.mobile ? 'Mobile!' : 'Other!'}</p></span>)
      }
    </MediaContext.Consumer>);
}

describe('<MediaContext />', () => {
  before(() => {
    // mock browser media match to have local screen
    const matchMediaMock = getMatchMediaMock({ type: 'screen', width: 300 });
    window.matchMedia = matchMediaMock.matchMedia;
  });

  after(() => {
    delete window.matchMedia;
  });

  it('provides current media context', () => {
    const component =
      mount(
        <MediaQueryProvider>
          <TestComponentWithContext />
        </MediaQueryProvider>,
      );
    expect(component.find('.test-component').text()).to.equal('Mobile!');
  });

  it('provides an empty object if wrapper <MediaQueryProvider /> is not up in the tree', () => {
    const component =
      mount(
        <TestComponentWithContext />,
      );
    expect(component.find('.test-component').text()).to.equal('Other!');
  });
});
