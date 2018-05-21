'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _cssMediaquery = require('css-mediaquery');

var _cssMediaquery2 = _interopRequireDefault(_cssMediaquery);

var _detectNode = require('detect-node');

var _detectNode2 = _interopRequireDefault(_detectNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this is for server side rendering and does not use window.matchMedia
var MediaQueryProvider = function (_React$Component) {
  (0, _inherits3.default)(MediaQueryProvider, _React$Component);

  function MediaQueryProvider(props) {
    (0, _classCallCheck3.default)(this, MediaQueryProvider);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MediaQueryProvider.__proto__ || (0, _getPrototypeOf2.default)(MediaQueryProvider)).call(this, props));

    var queryTuples = (0, _entries2.default)(_this.props.queries);

    var media = queryTuples.reduce(function (acc, _ref) {
      var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
          queryName = _ref2[0],
          query = _ref2[1];

      if (_this.props.values) {
        acc[queryName] = _cssMediaquery2.default.match(query, _this.props.values);
      } else {
        // if the consumer has not set `values` and is server rendering, default to false
        // because we don't know the screen size
        acc[queryName] = _detectNode2.default ? false : window.matchMedia(query).matches;
      }
      return acc;
    }, {});

    _this.mediaQueryListInstanceMap = new _map2.default();

    _this.state = {
      media: media
    };

    _this.mediaQueryListener = _this.mediaQueryListener.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(MediaQueryProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return this.state;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var media = (0, _entries2.default)(this.props.queries).reduce(function (acc, _ref3) {
        var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
            queryName = _ref4[0],
            query = _ref4[1];

        var mediaQueryListInstance = window.matchMedia(query);

        mediaQueryListInstance.addListener(_this2.mediaQueryListener);

        // this is so we can keep a reference to the MediaQueryList for removing the listener
        // and knowing the queryName in `mediaQueryListener`
        _this2.mediaQueryListInstanceMap.set(mediaQueryListInstance, queryName);

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

      this.mediaQueryListInstanceMap.forEach(function (_, mediaQueryList) {
        mediaQueryList.removeListener(_this3.mediaQueryListener);
      });
    }
  }, {
    key: 'mediaQueryListener',
    value: function mediaQueryListener(_ref5) {
      var matches = _ref5.matches,
          target = _ref5.target;

      var queryName = this.mediaQueryListInstanceMap.get(target);
      var newMedia = (0, _assign2.default)({}, this.state.media, (0, _defineProperty3.default)({}, queryName, matches));

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