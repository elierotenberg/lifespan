"use strict";

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
module.exports = function (Lifespan) {
  return Object.defineProperties({
    _lifespan: null,

    componentWillUnmount: function componentWillUnmount() {
      if (this._lifespan) {
        this._lifespan.release();
        this._lifespan = null;
      }
    } }, {
    lifespan: {
      get: function () {
        if (!this._lifespan) {
          this._lifespan = new Lifespan();
        }
        return this._lifespan;
      },
      enumerable: true,
      configurable: true
    }
  });
};