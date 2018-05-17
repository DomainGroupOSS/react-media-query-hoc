import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import withMedia from '../src/with-media';
import TestComponent from './utils/test-component';

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
    }).to.not.throw();
  });

  it('should render mobile view', () => {
    component = mount(<TestComponentWithMedia />, testContext);
    expect(component.text()).to.equal('Mobile!');
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
      testContext,
    );
    expect(receivedRef).to.equal(true);
  });
});
