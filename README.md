# react-media-query-hoc
A dead simple React Higher Order Component (HOC) that uses context for matching media queries

## Why use this?
- A simple API which doesnt require you to put `MediaQuery` components all over your code base
- More performant (you only need 1 parent `MediaQueryProvider` that listens to media events you wish to configure)
- Easier to test than other react media query libraries
- Uses `matchmedia` for media queries for client and server
- Abstracted away React context which is experimental (and subject to change) 

## Usage

This library is designed so that you have 1 `MediaQueryProvider` parent and 1-many child components wrapped with `withMedia` HOC

### `MediaQueryProvider`

This component will listen to media events you want to configure, it should be used once as a parent component

**Usage:**

```
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

By providing no `queries` prop to the `MediaQueryProvider` component, it will default to these media queries:
https://github.com/jooj123/react-media-query-hoc/blob/8d1a3860dc29462436ca9545a33904cb0d38afae/src/media-query-provider.js#L5

But you can provide different media queries for your use case.

### `withMedia`

This is a HOC to provide media match props to your component.
This abstracts away context so that if there is any changes to the API in the future its easier to upgrade (see: [React Context](https://facebook.github.io/react/docs/context.html))

**Usage:**
```
import { withMedia } from 'react-media-query-hoc';

const MyComponent = ({ media, ...props}) => (
  if(media.tablet || media.mobile) {
    .. 
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
  )
);

export const BaseMyComponent = MyComponent;
export default withMedia(MyComponent);
```


## Thanks

Big thanks to the maintainers of these repos
- https://github.com/jxnblk/react-media-context
- https://github.com/contra/react-responsive

Both libraries are a bit similar, but my original use case required the extra advantages listed in [Why use this?](#why-heading)
