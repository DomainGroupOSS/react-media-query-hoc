'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _matchmedia = require('matchmedia');

var _matchmedia2 = _interopRequireDefault(_matchmedia);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultQueries = {
  mobile: 'screen and (max-width: 623px)',
  tablet: 'screen and (min-width: 624px) and (max-width: 1020px)',
  desktop: 'screen and (min-width: 1021px) and (max-width: 1440px)',
  largeDesktop: 'screen and (min-width: 1441px)'
};

var MediaQueryProvider = function (_React$Component) {
  _inherits(MediaQueryProvider, _React$Component);

  function MediaQueryProvider() {
    _classCallCheck(this, MediaQueryProvider);

    var _this = _possibleConstructorReturn(this, (MediaQueryProvider.__proto__ || Object.getPrototypeOf(MediaQueryProvider)).call(this));

    _this.state = {
      media: {}
    };

    _this.match = _this.match.bind(_this);
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

      this.match();

      Object.keys(this.props.queries).forEach(function (key) {
        (0, _matchmedia2.default)(_this2.props.queries[key], {}).addListener(_this2.match);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      Object.keys(this.props.queries).forEach(function (key) {
        (0, _matchmedia2.default)(_this3.props.queries[key], {}).removeListener(_this3.match);
      });
    }
  }, {
    key: 'match',
    value: function match() {
      var _this4 = this;

      var media = {};

      Object.keys(this.props.queries).forEach(function (key) {
        var _matchMedia = (0, _matchmedia2.default)(_this4.props.queries[key], {}),
            matches = _matchMedia.matches;

        media[key] = matches;
      });

      this.setState({ media: media });
    }
  }, {
    key: 'render',
    value: function render() {
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
  queries: _propTypes2.default.object, // eslint-disable-line react/forbid-prop-types
  children: _propTypes2.default.node.isRequired
};

MediaQueryProvider.defaultProps = {
  queries: defaultQueries
};

exports.default = MediaQueryProvider;