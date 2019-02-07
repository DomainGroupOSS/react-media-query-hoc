import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import getMatchMediaMock from './utils/get-match-media-mock';
import MediaQueryProvider, { MediaContext } from '../src/media-query-provider';

describe('<MediaQueryProvider />', () => {
  let component;
  let matchMediaMock;

  before(() => {
    // TODO see https://github.com/sinonjs/sinon/issues/1377
    Object.defineProperty(global, 'HTMLElement', {
      configurable: true,
      value: () => {},
    });
  });

  beforeEach(() => {
    matchMediaMock = getMatchMediaMock({ type: 'screen', width: 1200 });
    window.matchMedia = matchMediaMock.matchMedia;
  });

  after(() => {
    Reflect.deleteProperty(global, 'HTMLElement');
    delete window.matchMedia;
  });

  it('should render app', () => {
    expect(() => {
      component = mount(
        <MediaQueryProvider>
          <p>Test123</p>
        </MediaQueryProvider>,
      );
    }).to.not.throw();
  });

  it('should have a default queries prop', () => {
    expect(component.props().queries).to.be.an('object');
  });

  function setupMountMediaQueryProvider({ queries, values } = {}) {
    const child = sinon.spy();
    component = mount(
      <MediaQueryProvider queries={queries} values={values}>
        <MediaContext>{child}</MediaContext>
      </MediaQueryProvider>,
    );
    return { component, child };
  }

  it('should have child context with default media', () => {
    const { child } = setupMountMediaQueryProvider();

    expect(child.lastCall.args).to.eql([
      {
        desktop: true,
        largeDesktop: false,
        mobile: false,
        tablet: false,
      },
    ]);
  });

  it('should have child context with other media', () => {
    const queries = {
      someMediaQuery: 'screen and (max-width: 1111px)',
      someMediaQuery2:
        'screen and (min-width: 2222px) and (max-width: 33333px)',
      someMediaQuery3:
        'screen and (min-width: 44444px) and (max-width: 55555px)',
      someMediaQuery4: 'screen and (min-width: 66666px)',
    };

    const { child } = setupMountMediaQueryProvider({ queries });

    expect(child.lastCall.args).to.eql([
      {
        someMediaQuery: false,
        someMediaQuery2: false,
        someMediaQuery3: false,
        someMediaQuery4: false,
      },
    ]);
  });

  it('should render mobile when value specified from server', () => {
    const values = {
      width: 300,
      type: 'screen',
    };

    // dont want to do client mount
    const stub = sinon
      .stub(MediaQueryProvider.prototype, 'componentDidMount')
      .returns('hi!');

    const { child } = setupMountMediaQueryProvider({ values });

    expect(MediaQueryProvider.prototype.componentDidMount).to.have.property(
      'callCount',
      1,
    );

    expect(child.lastCall.args).to.eql([
      {
        mobile: true,
        tablet: false,
        desktop: false,
        largeDesktop: false,
      },
    ]);

    stub.restore();
  });

  it('sets up MediaQueryList instaces when mounted', () => {
    const spy = sinon.spy(window, 'matchMedia');

    shallow(
      <MediaQueryProvider>
        <p>Test123</p>
      </MediaQueryProvider>,
    );

    spy.restore();

    expect(spy.callCount).to.equal(4);
  });

  it('handles matchMedia listener events and updates the context', () => {
    const { child } = setupMountMediaQueryProvider();

    matchMediaMock.update({ type: 'screen', width: 600 });

    // wait untile component updated
    setTimeout(() => {
      // get last 2 args
      expect(child.args.slice(child.args.length - 2)).to.eql([
        [
          {
            desktop: true,
            largeDesktop: false,
            mobile: false,
            tablet: false,
          },
        ],
        [
          {
            desktop: false,
            largeDesktop: false,
            mobile: true,
            tablet: false,
          },
        ],
      ]);
    }, 20);
  });

  describe('constructor state initialisation', () => {
    it('uses `cssMediaQuery` to query when values is provided', () => {
      const values = {
        width: 300,
        type: 'screen',
      };

      const wrapper = shallow(
        <MediaQueryProvider values={values}>
          <p>Test123</p>
        </MediaQueryProvider>,
        { disableLifecycleMethods: true },
      );

      expect(wrapper.state('media')).to.eql({
        mobile: true,
        tablet: false,
        desktop: false,
        largeDesktop: false,
      });
    });

    it('defaults to false when values is not provided and we are on the server', () => {
      const wrapper = shallow(
        <MediaQueryProvider>
          <p>Test123</p>
        </MediaQueryProvider>,
        { disableLifecycleMethods: true },
      );

      expect(wrapper.state('media')).to.eql({
        mobile: false,
        tablet: false,
        desktop: false,
        largeDesktop: false,
      });
    });
  });

  it('removes the listeners from the MediaQueryList instaces on unmount', () => {
    const mediaQueryListInstanceSpies = [];

    const oldWindowMatchMedia = window.matchMedia;

    window.matchMedia = (query) => {
      const mockInstance = oldWindowMatchMedia(query);
      mediaQueryListInstanceSpies.push(
        sinon.spy(mockInstance, 'removeListener'),
      );
      return mockInstance;
    };

    const instance = shallow(
      <MediaQueryProvider>
        <p>Test123</p>
      </MediaQueryProvider>,
    );

    window.matchMedia = oldWindowMatchMedia;

    instance.unmount();

    mediaQueryListInstanceSpies.forEach((spy) => {
      expect(spy.calledOnce).to.equal(true);
    });
  });

  context('when rendering server-side', () => {
    it('should render', () => {
      expect(() => {
        ReactDOMServer.renderToString(
          <MediaQueryProvider>
            <p>Test123</p>
          </MediaQueryProvider>,
        );
      }).to.not.throw();
    });
  });

  describe('rendering children', () => {
    it('when multiple children are provided we use React.Fragment', () => {
      const testComponent = mount(
        <MediaQueryProvider>
          <p>Test123</p>
          <p>Test123</p>
        </MediaQueryProvider>,
      );
      expect(testComponent.find('div').exists()).to.eql(false);
    });

    describe('when React.Fragment is not available', () => {
      let oldReactFragement;

      before(() => {
        oldReactFragement = React.Fragment;
        Reflect.deleteProperty(React, 'Fragment');
      });

      after(() => {
        React.Fragment = oldReactFragement;
      });

      it('when multiple children are provided we wrap in a div', () => {
        const testComponent = mount(
          <MediaQueryProvider>
            <p>Test123</p>
            <p>Test123</p>
          </MediaQueryProvider>,
        );
        expect(testComponent.find('div').exists()).to.eql(true);
      });

      it('renders no div when we have one child', () => {
        const testComponent = mount(
          <MediaQueryProvider>
            <p>Test123</p>
          </MediaQueryProvider>,
        );
        expect(testComponent.find('div').exists()).to.equal(false);
      });
    });
  });
});
