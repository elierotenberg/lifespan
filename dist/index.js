'use strict';

<<<<<<< HEAD
var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

require("babel/polyfill");
var _ = require("lodash");
var should = require("should");
var Promise = (global || window).Promise = require("bluebird");
var __DEV__ = process.env.NODE_ENV !== "production";
=======
require('babel/polyfill');
var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
>>>>>>> starterkit/master
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}
var _setInterval = global.setInterval;
var _setTimeout = global.setTimeout;
var _setImmediate = global.setImmediate;
var _Promise = global.Promise;
var _requestAnimationFrame = global.requestAnimationFrame;

var Mixin = _interopRequire(require("./Mixin"));

var Lifespan = (function () {
  function Lifespan() {
    _classCallCheck(this, Lifespan);

    this._callbacks = [];
    this._released = false;
    _.bindAll(this, ["release", "onRelease", "setInterval", "setTimeout", "setImmediate", "requestAnimationFrame", "Promise"]);
  }

  _prototypeProperties(Lifespan, {
    race: {
      value: function race() {
        for (var _len = arguments.length, lifespans = Array(_len), _key = 0; _key < _len; _key++) {
          lifespans[_key] = arguments[_key];
        }

        // creates a new lifespan, which is released when any of the lifespans are released
        var r = new Lifespan();
        lifespans.forEach(function (lifespan) {
          return lifespan.onRelease(r.release);
        });
        return r;
      },
      writable: true,
      configurable: true
    },
    join: {
      value: function join() {
        for (var _len = arguments.length, lifespans = Array(_len), _key = 0; _key < _len; _key++) {
          lifespans[_key] = arguments[_key];
        }

        // creates a new lifespan, which is released when all the lifespans are released
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
      },
      writable: true,
      configurable: true
    }
  }, {
    release: {
      value: function release() {
        if (this._released) {
          return;
        }
        this._released = true;
        this._callbacks.forEach(function (fn) {
          return fn();
        });
        this._callbacks = null;
        return this;
      },
      writable: true,
      configurable: true
    },
    onRelease: {
      value: function onRelease(fn) {
        if (this._released) {
          fn();
        } else {
          this._callbacks.unshift(fn);
        }
        return this;
      },
      writable: true,
      configurable: true
    },
    setInterval: {
      value: function setInterval(fn, period) {
        // set an interval that will be cleared upon release
        if (__DEV__) {
          fn.should.be.a.Function;
          period.should.be.a.Number.which.is.not.below(0);
        }
        var i = _setInterval(fn, period);
        this.onRelease(function () {
          return clearInterval(i);
        });
        return this;
      },
      writable: true,
      configurable: true
    },
    setTimeout: {
      value: function setTimeout(fn, delay) {
        // set a timeout that will be cleared upon release
        if (__DEV__) {
          fn.should.be.a.Function;
          delay.should.be.a.Number.which.is.not.below(0);
        }
        var i = _setTimeout(fn, delay);
        this.onRelease(function () {
          return clearTimeout(i);
        });
        return this;
      },
      writable: true,
      configurable: true
    },
    setImmediate: {
      value: function setImmediate(fn) {
        // set an immediate that will be cleared upon release
        if (__DEV__) {
          fn.should.be.a.Function;
        }
        var i = _setImmediate(fn);
        this.onRelease(function () {
          return clearImmediate(i);
        });
        return this;
      },
      writable: true,
      configurable: true
    },
    requestAnimationFrame: {
      value: function requestAnimationFrame(fn) {
        // sets a next animation frame callback  that will be cleared upon release
        if (__DEV__) {
          fn.should.be.a.Function;
        }
        var i = _requestAnimationFrame(fn);
        this.onRelease(function () {
          return cancelAnimationFrame(i);
        });
        return this;
      },
      writable: true,
      configurable: true
    },
    Promise: {
      value: function Promise() {
        var _this = this;
        // returns a Promise that will be resolved after release (deferred callback)
        return new _Promise(function (resolve) {
          return _this.onRelease(resolve);
        });
      },
      writable: true,
      configurable: true
    }
  });

  return Lifespan;
})();

Lifespan.Mixin = Mixin(Lifespan);

module.exports = Lifespan;
