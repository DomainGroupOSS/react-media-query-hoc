# react-media-query-hoc
A dead simple React Higher Order Component (HOC) that uses context for matching media queries

# Why ?
- Easy to test:
- Performance: you can wrap your whole parent component in the HOC - and only have `matchMedia` event listeners firing for the number of screens you wish to configure

# Usage

# Thanks

Big thanks to the maintainers of these repos
- https://github.com/jxnblk/react-media-context
- https://github.com/contra/react-responsive

Both libraries are a bit simular to this library .. but my original use case required:
- A simpler API where you didnt need to put `MediaQuery` components all over your code base
- More performant (you only need 1 parent `MediaQueryProvider` that listens to screen events)
- Easier to test (`react-responsive` in particular is hard to test with)
- Used which also used `matchmedia` (Media queries for client and server)
- Abstracted away React context which is experimental
