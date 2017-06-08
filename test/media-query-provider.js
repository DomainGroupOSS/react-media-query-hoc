/* eslint-disable */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import expect from 'expect';
import { mount } from 'enzyme';
import MediaQueryProvider from '../src/media-query-provider';

require('jsdom-global')();

describe('<MediaQueryProvider />', () => {
  let component;

  before(() => {
    window.matchMedia = () => {
      return {
        matches: false,
      };
    };
  });

  it('should render app', () => {
    expect(() => {
      component = mount(
        <MediaQueryProvider>
          <p>Test123</p>
        </MediaQueryProvider>,
      );
    }).toNotThrow();
  });

  it('should have a default queries prop', () => {
    expect(component.props().queries).toBeAn('object');
  });

  it('should have child context with default media', () => {
    expect(component.node.getChildContext().media).toEqual({
      desktop: false,
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

    const otherComponent = mount(
      <MediaQueryProvider queries={queries}>
        <p>Test123</p>
      </MediaQueryProvider>,
    );

    expect(otherComponent.node.getChildContext().media).toEqual({
      someMediaQuery: false,
      someMediaQuery2: false,
      someMediaQuery3: false,
      someMediaQuery4: false,
    });
  });

  describe('when mobile matches', () => {
    let mobileComponent;

    before(() => {
      window.matchMedia = (query) => {
        return {
          matches: /max\-width:\s623px\)$/.test(query),
        };
      };

      mobileComponent = mount(
        <MediaQueryProvider>
          <p>Test123</p>
        </MediaQueryProvider>,
      );
    });

    it('should include mobile in the media context', () => {
      const { media } = mobileComponent.node.getChildContext();
      expect(media).toEqual({
        desktop: false,
        largeDesktop: false,
        mobile: false,
        tablet: false,
      });
    });
  });

  describe('when rendering server-side', () => {
    it('should render', () => {
      expect(() => {
        const html = ReactDOMServer.renderToString(
          <MediaQueryProvider>
            <p>Test123</p>
          </MediaQueryProvider>,
        );
      }).toNotThrow();
    });
  });
});
