const React = require('react');
const ReactDOM = require('react-dom');

const App = React.createFactory(require('./components/App'));

ReactDOM.render(App(window.APP_PROPS), document.getElementById('content'));

