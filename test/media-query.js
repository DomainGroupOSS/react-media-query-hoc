require('jsdom-global')()

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import expect from 'expect';
import { mount } from 'enzyme';
import sinon from 'sinon';
import mediaQueryWrapper from '../src/media-query';
import TestComponent from './test-component';

describe('<MediaQueryHOC />', () => {
  let tree;
  let WrappedComponent;

  before(() => {
    // Stub matchMedia
    window.matchMedia = () => {
      return {
        matches: false
      }
    };

    WrappedComponent = mediaQueryWrapper()(TestComponent);
  })

  it('should render', () => {
    expect(() => {
      tree = mount(<WrappedComponent />);
    }).toNotThrow()
  })

  it('calls componentDidMount', () => {
    sinon.spy(WrappedComponent.prototype, 'componentDidMount');
    const wrapper = mount(<WrappedComponent />);
    expect(WrappedComponent.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  // it('should have a default queries prop', () => {
  //   expect(tree.props().queries).toBeAn('object')
  // })

  // it('should have child context', () => {
  //   expect(tree.node.getChildContext().media).toEqual([])
  // })

  // context('when xsmall matches', () => {
  //   before(() => {
  //     window.matchMedia = (query) => {
  //       return {
  //         matches: /max\-width:\s40em\)$/.test(query)
  //       }
  //     }
  //     tree = mount(<MediaContext />)
  //   })

  //   it('should include xsmall in the media context', () => {
  //     const { media } = tree.node.getChildContext()
  //     expect(media).toEqual(['xsmall'])
  //   })
  // })

  // context('when small matches', () => {
  //   before(() => {
  //     window.matchMedia = (query) => {
  //       return {
  //         matches: /min\-width:\s40em\)$/.test(query)
  //       }
  //     }
  //     tree = mount(<MediaContext />)
  //   })

  //   it('should include small in the media context', () => {
  //     const { media } = tree.node.getChildContext()
  //     expect(media).toEqual(['small'])
  //   })
  // })

  // context('when medium matches', () => {
  //   before(() => {
  //     window.matchMedia = (query) => {
  //       return {
  //         matches: /min\-width:\s52em\)$/.test(query)
  //       }
  //     }
  //     tree = mount(<MediaContext />)
  //   })

  //   it('should include medium in the media context', () => {
  //     const { media } = tree.node.getChildContext()
  //     expect(media).toEqual(['medium'])
  //   })
  // })

  // context('when large matches', () => {
  //   before(() => {
  //     window.matchMedia = (query) => {
  //       return {
  //         matches: /min\-width:\s64em\)$/.test(query)
  //       }
  //     }
  //     tree = mount(<MediaContext />)
  //   })

  //   it('should include large in the media context', () => {
  //     const { media } = tree.node.getChildContext()
  //     expect(media).toEqual(['large'])
  //   })
  // })

  // context('when setting custom queries', () => {
  //   before(() => {
  //     window.matchMedia = (query) => {
  //       return {
  //         matches: /min\-width:\s640px\)$/.test(query)
  //       }
  //     }

  //     tree = mount(
  //       <MediaContext
  //         queries={{
  //           'mobile': 'screen and (max-width: 640px)',
  //           'desktop': 'screen and (min-width: 640px)'
  //         }} />
  //     )
  //   })

  //   it('should include custom media queries in context', () => {
  //     const { media } = tree.node.getChildContext()
  //     expect(media).toEqual(['desktop'])
  //   })
  // })

  // context('when resizing the window', () => {
  //   let match
  //   let handleResize

  //   before(() => {
  //     window.matchMedia = (query) => {
  //       return { matches: false }
  //     }
  //     match = expect.spyOn(MediaContext.prototype, 'match')
  //     handleResize = expect.spyOn(MediaContext.prototype, 'handleResize')
  //     tree = mount(<MediaContext />)
  //     const e = new Event('resize')
  //     window.dispatchEvent(e)
  //   })

  //   it('should call the handleResize method', () => {
  //     expect(handleResize.call.length).toEqual(1)
  //   })

  //   it('should call the match method', () => {
  //     expect(match.calls.length).toEqual(1)
  //   })
  // })

  // context('when rendering server-side', () => {
  //   it('should render', () => {
  //     expect(() => {
  //       const html = ReactDOMServer.renderToString(<MediaContext />)
  //     }).toNotThrow()
  //   })
  // })
})