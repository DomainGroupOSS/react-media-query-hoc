'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaContext = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _cssMediaquery = require('css-mediaquery');

var _cssMediaquery2 = _interopRequireDefault(_cssMediaquery);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// this is for server side rendering and does not use window.matchMedia


var hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

var MediaContext = _react2.default.createContext({});

var MediaQueryProvider = function (_React$Component) {
  _inherits(MediaQueryProvider, _React$Component);

  function MediaQueryProvider(props) {
    _classCallCheck(this, MediaQueryProvider);

    var _this = _possibleConstructorReturn(this, (MediaQueryProvider.__proto__ || Object.getPrototypeOf(MediaQueryProvider)).call(this, props));

    var media = Object.keys(_this.props.queries).reduce(function (acc, queryName) {
      var query = _this.props.queries[queryName];

      if (_this.props.values) {
        acc[queryName] = _cssMediaquery2.default.match(query, _this.props.values);
      } else {
        // if the consumer has not set `values` and is server rendering, default to false
        // because we don't know the screen size
        acc[queryName] = hasMatchMedia ? window.matchMedia(query).matches : false;
      }

      return acc;
    }, {});

    _this.mediaQueryListInstanceMap = new Map();

    _this.state = {
      media: media
    };

    _this.mediaQueryListener = _this.mediaQueryListener.bind(_this);

    _this.currentMediaState = _this.state.media;
    _this.updateState = (0, _utils.debounce)(function (newMedia) {
      if (!(0, _shallowequal2.default)(newMedia, _this.state.media)) {
        _this.setState({ media: newMedia });
      }
    }, 20);
    return _this;
  }

  _createClass(MediaQueryProvider, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var media = Object.keys(this.props.queries).reduce(function (acc, queryName) {
        var mediaQueryListInstance = window.matchMedia(_this2.props.queries[queryName]);

        mediaQueryListInstance.addListener(_this2.mediaQueryListener);

        // this is so we can keep a reference to the MediaQueryList for removing the listener
        // and knowing the queryName in `mediaQueryListener`
        _this2.mediaQueryListInstanceMap.set(mediaQueryListInstance.media, {
          query: mediaQueryListInstance,
          queryName: queryName
        });

        acc[queryName] = mediaQueryListInstance.matches;
        return acc;
      }, {});

      // need to rerender with correct media if it didnt match up with initial
      if (!(0, _shallowequal2.default)(media, this.state.media)) {
        this.setState({ media: media }); // eslint-disable-line react/no-did-mount-set-state
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      this.mediaQueryListInstanceMap.forEach(function (mediaQueryList) {
        return mediaQueryList.query.removeListener(_this3.mediaQueryListener);
      });
    }
  }, {
    key: 'mediaQueryListener',
    value: function mediaQueryListener(_ref) {
      var matches = _ref.matches,
          media = _ref.media;

      var _mediaQueryListInstan = this.mediaQueryListInstanceMap.get(media),
          queryName = _mediaQueryListInstan.queryName;

      this.currentMediaState = _extends({}, this.currentMediaState, _defineProperty({}, queryName, matches));
      this.updateState(this.currentMediaState);
    }
  }, {
    key: 'children',
    value: function children() {
      if (_react2.default.Fragment) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          null,
          this.props.children
        );
      }

      if (_react2.default.Children.count(this.props.children) === 1) {
        return this.props.children;
      }

      return _react2.default.createElement(
        'div',
        null,
        this.props.children
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        MediaContext.Provider,
        { value: this.state.media },
        this.children()
      );
    }
  }]);

  return MediaQueryProvider;
}(_react2.default.Component);

MediaQueryProvider.propTypes = {
  children: _propTypes2.default.node.isRequired,
  queries: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  values: _propTypes2.default.object // eslint-disable-line react/forbid-prop-types
};

MediaQueryProvider.defaultProps = {
  queries: {
    mobile: 'screen and (max-width: 623px)',
    tablet: 'screen and (min-width: 624px) and (max-width: 1020px)',
    desktop: 'screen and (min-width: 1021px) and (max-width: 1440px)',
    largeDesktop: 'screen and (min-width: 1441px)'
  },
  values: {}
};

exports.MediaContext = MediaContext;
exports.default = MediaQueryProvider;