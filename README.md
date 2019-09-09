# react-media-query-hoc  [![Build Status](https://travis-ci.org/DomainGroupOSS/react-media-query-hoc.svg?branch=master)](https://travis-ci.com/DomainGroupOSS/react-media-query-hoc) ![NPM Version Badge](https://badge.fury.io/js/react-media-query-hoc.svg)

A dead simple React Higher Order Component (HOC) that uses context for matching media queries.


## Why use this?
- A simple API which doesnt require you to put `MediaQuery` components all over your code base
- More performant (you only need 1 parent `MediaQueryProvider` that listens to media events you wish to configure)
- Easier to test than other react media query libraries
- Small [bundlephobia](https://bundlephobia.com/result?p=react-media-query-hoc@latest)
- Uses [css-mediaquery](https://github.com/ericf/css-mediaquery) which parses and determines if a given CSS Media Query
matches a set of values (used for server side rendering).
- You want specific react components being mounted and rendered based on media types

## Why not use this?
We generally recommend using vanilla CSS media queries to build responsive websites, this is simpler, provides a smoother UX, also it mitigates having to guess the screen width during [server side rendering](#server-side-rendering). 
Use this library if you need to dramatically alter the page layout between media types (**some examples include:** an experiment needs to be run on a specific screen width or an advertisement needs to be on specific screen width).

## Install

Via [NPM](https://docs.npmjs.com/):
```bash
npm install react-media-query-hoc --save
```

Via [Yarn](https://yarnpkg.com/en/):
```bash
yarn add react-media-query-hoc
```


## Usage

This library is designed so that you have 1 `MediaQueryProvider` parent and 1-many child components wrapped with `withMedia` HOC

### `MediaQueryProvider`

This component will listen to media events you want to configure, it should be used once as a parent component.

**Usage:**

```javascript
import { MediaQueryProvider } from 'react-media-query-hoc';

const App = (props) => {
  return (
    <MediaQueryProvider>
      <TheRestOfMyApp />
    </MediaQueryProvider>
  );
};

export default App;
```

By providing no `queries` prop to the `MediaQueryProvider` component, it will default to these [media queries](https://github.com/jooj123/react-media-query-hoc/blob/8d1a3860dc29462436ca9545a33904cb0d38afae/src/media-query-provider.js#L5)

But you can provide different media queries for your use case using the `queries` prop, eg:

```javascript
const App = (props) => {
  const customQueries = {
    verySmall: 'screen and (max-width: 300px)',
    someOtherMediaQuery: 'screen and (min-width: 301px)',
  };

  return (
    <MediaQueryProvider queries={customQueries}>
      <TheRestOfMyApp />
    </MediaQueryProvider>
  );
};
```

### `withMedia`

This is a HOC to provide media match props to your component.

**Usage:**
```javascript
import { withMedia } from 'react-media-query-hoc';

const MyComponent = ({ media, ...props}) => {
  if (media.tablet || media.mobile) {
    return (
      <div>
        Mobile and Tablet View
      </div>
    )
  }

  return (
    <div>
      Other View
    </div>
  );
};

export const BaseMyComponent = MyComponent;
export default withMedia(MyComponent);
```

Components wrapped by `withMedia()` won't work with React's usual `ref` mechanism, because the ref supplied will be for `withMedia` rather than the wrapped component. Therefore a prop, `wrappedRef` provides the same function. Note: this means the wrapped component can not be a [stateless function](https://github.com/facebook/react/issues/10831).

### `MediaContext`
This is the React Context exported and ready to be used with React `useContext` hook. It has a default value of `{}`, present when the component that consumes the context is not wrapped with `MediaQueryProvider`.

```javascript
import { MediaContext } from 'react-media-query-hoc';
import { useContext } from 'react';

const MyComponent = (props) => {
  const media = useContext(MediaContext);

  if(media.tablet || media.mobile) {
    return (
      <div>
        Mobile and Tablet View
      </div>
    )
  }

  return (
    <div>
      Other View
    </div>
  );
};

export default MyComponent;

// default value
ReactDOM.render(<MyComponent />);     // Renders 'Other View';
```

### Server Side Rendering

You can pass in media features from your server, all supported values can be found [here](https://www.w3.org/TR/css3-mediaqueries/#media1).

**Usage (matches mobile screen during SSR):**
```javascript
const App = (props) => {
  const values = {
    width: 300,
    type: 'screen',
  };

  return (
    <MediaQueryProvider values={values}>
      <TheRestOfMyApp />
    </MediaQueryProvider>
  );
};
```

#### React 16 ReactDOM.hydrate

It's very important to realise a server client mismatch is dangerous when using hydrate in React 16, ReactDOM.hydrate
can cause very [strange](https://github.com/facebook/react/issues/10591) html on the client if there is a mismatch.
To mitigate this we use the two-pass rendering technique mentioned in the React [docs](https://reactjs.org/docs/react-dom.html#hydrate).
We render on the client in the first pass using `values` with `css-mediaquery` used on the server, then we use the browsers native `window.matchMedia`
to get it's actual dimensions and render again if it causes different query results. This means there should be no React
server/client mismatch warning in your console and you can safely use hydrate. As a result of above, if you are server side rendering and using `ReactDOM.hydrate` you must supply `MediaQueryProvider` a `values` prop.

## Browser Support

The oldest browser we support is IE11,
if you want to support even older browsers please make sure you are using a polyfill for [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) such as [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/).

## Testing Components

Because the media queries and context are abstracted out you can easily test components with or without the `withMedia` HOC, just ensure you export your component base without the HOC as well, eg:

```javascript
export const BaseMyComponent = MyComponent;
export default withMedia(MyComponent);
```

Then in your React tests you can import like:
```javascript
import { BaseMyComponent } from 'location_of_my_component';
```
And unit test the component without having to worry about context


## Thanks

Big thanks to the maintainers of these repos
- https://github.com/jxnblk/react-media-context
- https://github.com/contra/react-responsive

Both libraries are a bit similar, but my original use case required the extra advantages listed in [Why use this?](#why-use-this)
