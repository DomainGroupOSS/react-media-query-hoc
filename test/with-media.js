import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import withMedia from '../src/with-media';
import TestComponent from './utils/test-component';

import * as providerMock from '../src/media-query-provider';

describe('<withMedia />', () => {
  const TestComponentWithMedia = withMedia(TestComponent);
  let component;

  let media = { mobile: true };
  const originalProvider = providerMock.MediaContext;
  before(() => {
    providerMock.MediaContext.Consumer = ({ children }) => children(media);
  });
  afterEach(() => {
    media = { mobile: true };
  });
  after(() => {
    providerMock.MediaContext.Consumer = originalProvider;
  });

  it('should render with HOC', () => {
    expect(() => {
      component = mount(<TestComponentWithMedia />);
    }).to.not.throw();
  });

  it('should render mobile view', () => {
    component = mount(<TestComponentWithMedia />);
    expect(component.text()).to.equal('Mobile!');
  });

  it('should render other view', () => {
    media = { mobile: false };
    component = mount(<TestComponentWithMedia />);
    expect(component.text()).to.equal('Other!');
  });

  it('should provide a ref for the wrapped component', () => {
    let receivedRef = false;
    component = mount(
      <TestComponentWithMedia
        wrappedRef={() => {
          receivedRef = true;
        }}
      />,
    );
    expect(receivedRef).to.equal(true);
  });
});
