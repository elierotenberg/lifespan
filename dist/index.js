'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _Mixin = require('./Mixin');

var _Mixin2 = _interopRequireDefault(_Mixin);

var _ = require('lodash');
var should = require('should');
var _Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  _Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}

var Lifespan = (function () {
  function Lifespan() {
    _classCallCheck(this, Lifespan);

    this._callbacks = [];
    this._released = false;
    _.bindAll(this, ['release', 'onRelease', 'setInterval', 'setTimeout', 'setImmediate', 'requestAnimationFrame', 'Promise']);
  }

  _createClass(Lifespan, [{
    key: 'release',
    value: function release() {
      if (this._released) {
        return this;
      }
      this._released = true;
      this._callbacks.forEach(function (fn) {
        return fn();
      });
      this._callbacks = null;
      return this;
    }
  }, {
    key: 'onRelease',
    value: function onRelease(fn) {
      if (this._released) {
        fn();
      } else {
        this._callbacks.unshift(fn);
      }
      return this;
    }
  }, {
    key: 'setInterval',

    // set an interval that will be cleared upon release
    value: (function (_setInterval) {
      function setInterval(_x, _x2) {
        return _setInterval.apply(this, arguments);
      }

      setInterval.toString = function () {
        return _setInterval.toString();
      };

      return setInterval;
    })(function (fn, period) {
      if (__DEV__) {
        fn.should.be.a.Function;
        period.should.be.a.Number.which.is.not.below(0);
      }
      var i = setInterval(fn, period);
      this.onRelease(function () {
        return clearInterval(i);
      });
      return this;
    })
  }, {
    key: 'setTimeout',

    // set a timeout that will be cleared upon release
    value: (function (_setTimeout) {
      function setTimeout(_x3, _x4) {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    })(function (fn, delay) {
      if (__DEV__) {
        fn.should.be.a.Function;
        delay.should.be.a.Number.which.is.not.below(0);
      }
      var i = setTimeout(fn, delay);
      this.onRelease(function () {
        return clearTimeout(i);
      });
      return this;
    })
  }, {
    key: 'setImmediate',

    // set an immediate that will be cleared upon release
    value: (function (_setImmediate) {
      function setImmediate(_x5) {
        return _setImmediate.apply(this, arguments);
      }

      setImmediate.toString = function () {
        return _setImmediate.toString();
      };

      return setImmediate;
    })(function (fn) {
      if (__DEV__) {
        fn.should.be.a.Function;
      }
      var i = setImmediate(fn);
      this.onRelease(function () {
        return clearImmediate(i);
      });
      return this;
    })
  }, {
    key: 'requestAnimationFrame',

    // sets a next animation frame callback  that will be cleared upon release
    value: (function (_requestAnimationFrame) {
      function requestAnimationFrame(_x6) {
        return _requestAnimationFrame.apply(this, arguments);
      }

      requestAnimationFrame.toString = function () {
        return _requestAnimationFrame.toString();
      };

      return requestAnimationFrame;
    })(function (fn) {
      if (__DEV__) {
        fn.should.be.a.Function;
      }
      var i = requestAnimationFrame(fn);
      this.onRelease(function () {
        return cancelAnimationFrame(i);
      });
      return this;
    })
  }, {
    key: 'Promise',

    // returns a Promise that will be resolved after release (deferred callback)
    value: function Promise() {
      var _this = this;

      return new _Promise(function (resolve) {
        return _this.onRelease(resolve);
      });
    }
  }], [{
    key: 'race',

    // creates a new lifespan, which is released when any of the lifespans are released
    value: function race() {
      for (var _len = arguments.length, lifespans = Array(_len), _key = 0; _key < _len; _key++) {
        lifespans[_key] = arguments[_key];
      }

      var r = new Lifespan();
      lifespans.forEach(function (lifespan) {
        return lifespan.onRelease(r.release);
      });
      return r;
    }
  }, {
    key: 'join',

    // creates a new lifespan, which is released when all the lifespans are released
    value: function join() {
      for (var _len2 = arguments.length, lifespans = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        lifespans[_key2] = arguments[_key2];
      }

      var countDown = lifespans.length;
      var r = new Lifespan();
      lifespans.forEach(function (lifespan) {
        return lifespan.onRelease(function () {
          countDown = countDown - 1;
          if (countDown === 0) {
            r.release();
          }
        });
      });
      return r;
    }
  }]);

  return Lifespan;
})();

Lifespan.Mixin = (0, _Mixin2['default'])(Lifespan);

exports['default'] = Lifespan;
module.exports = exports['default'];