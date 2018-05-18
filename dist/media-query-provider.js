'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _cssMediaquery = require('css-mediaquery');

var _cssMediaquery2 = _interopRequireDefault(_cssMediaquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// this is for server side rendering and does not use window.matchMedia


var isServer = typeof process !== 'undefined';

var MediaQueryProvider = function (_React$Component) {
  _inherits(MediaQueryProvider, _React$Component);

  function MediaQueryProvider(props) {
    _classCallCheck(this, MediaQueryProvider);

    var _this = _possibleConstructorReturn(this, (MediaQueryProvider.__proto__ || Object.getPrototypeOf(MediaQueryProvider)).call(this, props));

    var queryTuples = Object.entries(_this.props.queries);

    var media = queryTuples.reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          queryName = _ref2[0],
          query = _ref2[1];

      if (_this.props.values) {
        acc[queryName] = _cssMediaquery2.default.match(query, _this.props.values);
      } else {
        // if the consumer has not set `values` and is server rendering, default to false
        // because we don't know the screen size
        acc[queryName] = isServer ? false : window.matchMedia(query).matches;
      }
      return acc;
    }, {});

    // this is for the mediaQueryListener to be able to find the queryName from it's event arg
    _this.reverseQueries = queryTuples.reduce(function (acc, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          queryName = _ref4[0],
          query = _ref4[1];

      acc[query] = queryName;
      return acc;
    }, {});

    _this.mediaQueryListInstanceArray = [];

    _this.state = {
      media: media
    };

    _this.mediaQueryListener = _this.mediaQueryListener.bind(_this);
    return _this;
  }

  _createClass(MediaQueryProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return this.state;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var media = Object.entries(this.props.queries).reduce(function (acc, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            queryName = _ref6[0],
            query = _ref6[1];

        var mediaQueryListInstance = window.matchMedia(query);

        mediaQueryListInstance.addListener(_this2.mediaQueryListener);

        _this2.mediaQueryListInstanceArray.push(mediaQueryListInstance);

        acc[queryName] = mediaQueryListInstance.matches;
        return acc;
      }, {});

      if (!(0, _shallowequal2.default)(media, this.state.media)) {
        this.setState({ media: media }); // eslint-disable-line react/no-did-mount-set-state
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      this.mediaQueryListInstanceArray.forEach(function (mediaQueryListInstance) {
        mediaQueryListInstance.removeListener(_this3.mediaQueryListener);
      });
    }
  }, {
    key: 'mediaQueryListener',
    value: function mediaQueryListener(_ref7) {
      var matches = _ref7.matches,
          media = _ref7.media;

      var queryName = this.reverseQueries[media];
      var newMedia = Object.assign({}, this.state.media, _defineProperty({}, queryName, matches));

      if (!(0, _shallowequal2.default)(newMedia, this.state.media)) {
        this.setState({ media: newMedia });
      }
    }
  }, {
    key: 'render',
    value: function render() {
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
  }]);

  return MediaQueryProvider;
}(_react2.default.Component);

MediaQueryProvider.childContextTypes = {
  media: _propTypes2.default.object
};

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

exports.default = MediaQueryProvider;