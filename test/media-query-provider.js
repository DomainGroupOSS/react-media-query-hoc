import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import matchMediaMock from 'match-media-mock';
import MediaQueryProvider from '../src/media-query-provider';

describe('<MediaQueryProvider />', () => {
  let component;

  before(() => {
    // TODO see https://github.com/sinonjs/sinon/issues/1377
    Object.defineProperty(global, 'HTMLElement', {
      configurable: true,
      value: () => {},
    });

    const matchMediaMockInstance = matchMediaMock.create();
    matchMediaMockInstance.setConfig({ type: 'screen', width: 1200 });
    window.matchMedia = matchMediaMockInstance;
  });

  after(() => {
    Reflect.deleteProperty(global, 'HTMLElement');
    delete window.matchMedia;
  });

  it('should render app', () => {
    expect(() => {
      component = mount(<MediaQueryProvider><p>Test123</p></MediaQueryProvider>);
    }).to.not.throw();
  });

  it('should have a default queries prop', () => {
    expect(component.props().queries).to.be.an('object');
  });

  it('should have child context with default media', () => {
    expect(component.node.getChildContext().media).to.eql({
      desktop: true,
      largeDesktop: false,
      mobile: false,
      tablet: false,
    });
  });

  it('should have child context with other media', () => {
    const queries = {
      someMediaQuery: 'screen and (max-width: 1111px)',
      someMediaQuery2: 'screen and (min-width: 2222px) and (max-width: 33333px)',
      someMediaQuery3: 'screen and (min-width: 44444px) and (max-width: 55555px)',
      someMediaQuery4: 'screen and (min-width: 66666px)',
    };

    const otherComponent =
      mount(<MediaQueryProvider queries={queries}><p>Test123</p></MediaQueryProvider>);

    expect(otherComponent.node.getChildContext().media).to.eql({
      someMediaQuery: false,
      someMediaQuery2: false,
      someMediaQuery3: false,
      someMediaQuery4: false,
    });
  });

  context('when mobile matches', () => {
    let mobileComponent;

    before(() => {
      mobileComponent = mount(<MediaQueryProvider><p>Test123</p></MediaQueryProvider>);
    });

    it('should include mobile in the media context', () => {
      const { media } = mobileComponent.node.getChildContext();
      expect(media).to.eql({
        desktop: true,
        largeDesktop: false,
        mobile: false,
        tablet: false,
      });
    });
  });

  it('should render mobile when value specified from server', () => {
    const values = {
      width: 300,
      type: 'screen',
    };

    // dont want to do client mount
    const stub = sinon.stub(MediaQueryProvider.prototype, 'componentDidMount').returns('hi!');

    const componentWithValues =
      mount(<MediaQueryProvider values={values}><p>Test123</p></MediaQueryProvider>);

    expect(MediaQueryProvider.prototype.componentDidMount).to.have.property('callCount', 1);

    const { media } = componentWithValues.node.getChildContext();

    expect(media).to.eql({
      mobile: true,
      tablet: false,
      desktop: false,
      largeDesktop: false,
    });

    stub.restore();
  });

  context('when rendering server-side', () => {
    it('should render', () => {
      expect(() => {
        ReactDOMServer.renderToString(<MediaQueryProvider><p>Test123</p></MediaQueryProvider>);
      }).to.not.throw();
    });
  });

  context('when React.Fragment is available', () => {
    before(() => {
      Object.defineProperty(React, 'Fragment', {
        configurable: true,
        value: React.createClass({
          render() {
            return React.createElement(
              'span',
              { className: 'wrapper' },
              Array.isArray(this.props.children)
                ? this.props.children.map(el => <span>{el}</span>)
                : this.props.children,
            );
          },
        }),
      });
    });

    after(() => {
      Reflect.deleteProperty(React, 'Fragment');
    });

    it('should use React.Fragment component', () => {
      const fragmentChildren = [<p>Test123</p>, <p>Test123</p>];
      const componentWithFrag =
        mount(<MediaQueryProvider><fragmentChildren /></MediaQueryProvider>);
      expect(componentWithFrag.find('span').is('span')).to.eql(true);
    });
  });

  describe('rendering children', () => {
    it('when React.Fragment is not available and multiple children are provided we wrap in a div', () => {
      const testComponent =
        mount(<MediaQueryProvider><p>Test123</p><p>Test123</p></MediaQueryProvider>);
      expect(testComponent.find('div').is('div')).to.eql(true);
    });

    it('renders no div when we have one child', () => {
      const testComponent =
        mount(<MediaQueryProvider><p>Test123</p></MediaQueryProvider>);
      expect(testComponent.find('div').exists()).to.equal(false);
    });
  });
});
