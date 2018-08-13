/* eslint-disable no-console, consistent-return, import/no-extraneous-dependencies */
require('babel-register');

const htmlescape = require('htmlescape');
const express = require('express');
const browserify = require('browserify');
const literalify = require('literalify');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const App = React.createFactory(require('./components/App'));

// lazy way to do a bundle cache
let BUNDLE = null;

const server = express();

server.get('/bundle.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript');

  // bundle cache
  if (BUNDLE != null) {
    return res.end(BUNDLE);
  }

  browserify()
    .add('./demo/browser.js')
    .transform('babelify', { presets: ['babel-preset-env', 'babel-preset-react'] })
    .transform(literalify.configure({
      react: 'window.React',
      'react-dom': 'window.ReactDOM',
    }))
    .bundle((err, buf) => {
      BUNDLE = buf;
      res.statusCode = err ? 500 : 200;
      res.end(err ? err.message : BUNDLE);
    });
});

server.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const { width } = req.query;

  const props = {
    values: {
      width: width || 1021, // default min desktop width
      type: 'screen',
    },
  };

  const markup = ReactDOMServer.renderToString(App(props));
  const safeProps = htmlescape(props);

  const html = `
<html lang="en-AU">
<head>
  <title>React Media HOC Example</title>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.development.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.development.js"></script>
</head>
<body>
  <div id="content">
    ${markup}
  </div>
  <script>window.APP_PROPS = ${safeProps};</script>
  <script src="/bundle.js"></script>
</body>
</html>
  `;

    // Return the page to the browser
  res.end(html);
});

server.listen(3000, () => console.log('Listening on port 3000!'));
