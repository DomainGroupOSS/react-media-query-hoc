/* eslint-disable import/prefer-default-export */

function debounce(func, wait) {
  let timeout;
  return function debouncedFn(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export { debounce };
