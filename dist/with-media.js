'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name;
}

var withMedia = function withMedia(WrappedComponent) {
  var MediaQueryWrapper = function (_React$Component) {
    (0, _inherits3.default)(MediaQueryWrapper, _React$Component);

    function MediaQueryWrapper() {
      (0, _classCallCheck3.default)(this, MediaQueryWrapper);
      return (0, _possibleConstructorReturn3.default)(this, (MediaQueryWrapper.__proto__ || (0, _getPrototypeOf2.default)(MediaQueryWrapper)).apply(this, arguments));
    }

    (0, _createClass3.default)(MediaQueryWrapper, [{
      key: 'render',
      value: function render() {
        var _props = this.props,
            wrappedRef = _props.wrappedRef,
            otherProps = (0, _objectWithoutProperties3.default)(_props, ['wrappedRef']);

        return _react2.default.createElement(WrappedComponent, (0, _extends3.default)({}, otherProps, {
          media: this.context.media,
          ref: wrappedRef
        }));
      }
    }]);
    return MediaQueryWrapper;
  }(_react2.default.Component);

  MediaQueryWrapper.contextTypes = {
    media: _propTypes2.default.object
  };

  MediaQueryWrapper.propTypes = {
    wrappedRef: _propTypes2.default.func
  };

  MediaQueryWrapper.defaultProps = {
    wrappedRef: undefined
  };

  MediaQueryWrapper.displayName = 'withMedia(' + getDisplayName(WrappedComponent) + ')';

  return (0, _hoistNonReactStatics2.default)(MediaQueryWrapper, WrappedComponent);
};

exports.default = withMedia;