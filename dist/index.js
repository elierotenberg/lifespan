"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var _ = require("lodash");
var should = require("should");
var Promise = (global || window).Promise = require("bluebird");
var __DEV__ = process.env.NODE_ENV !== "production";
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === "object";
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}
var Lifespan = (function () {
  var Lifespan = function Lifespan() {
    this._callbacks = [];
    this._released = false;
    _.bindAll(this);
  };

  _prototypeProperties(Lifespan, {
    race: {
      value: function () {
        var lifespans = [];

        for (var _key = 0; _key < arguments.length; _key++) {
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
      enumerable: true,
      configurable: true
    },
    join: {
      value: function () {
        var lifespans = [];

        for (var _key2 = 0; _key2 < arguments.length; _key2++) {
          lifespans[_key2] = arguments[_key2];
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
      enumerable: true,
      configurable: true
    }
  }, {
    release: {
      value: function () {
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
      enumerable: true,
      configurable: true
    },
    onRelease: {
      value: function (fn) {
        if (this._released) {
          fn();
        } else {
          this._callbacks.push(fn);
        }
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Lifespan;
})();

module.exports = Lifespan;