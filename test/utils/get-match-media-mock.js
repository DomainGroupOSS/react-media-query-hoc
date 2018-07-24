import cssMediaQuery from 'css-mediaquery';

export default (config) => {
  const listeners = {};
  return {
    update: (newConfig) => Object.keys(listeners).forEach((media) => {
      listeners[media].forEach((listener) => listener({ matches: cssMediaQuery.match(media, newConfig), media }));
    }),
    matchMedia: (media) => {
      listeners[media] = [];
      return {
        matches: cssMediaQuery.match(media, config),
        media,
        addListener: (listener) => { listeners[media].push(listener); },
        removeListener: () => {},
      };
    },
  };
};
