"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;var Lifespan = function Lifespan() {
  var _this = this;
  this._promise = new Promise(function (resolve, reject) {
    return _this._resolve = resolve || reject;
  });
};

Lifespan.prototype.kill = function () {
  this._resolve();
  return this._promise;
};

Lifespan.prototype.onDeath = function (fn) {
  return this.death.then(fn);
};

_prototypeProperties(Lifespan, null, {
  dies: {
    get: function () {
      return this._promise;
    },
    enumerable: true
  }
});

Object.assign(Lifespan.prototype, {
  _promise: null,
  _resolve: null });

module.exports = Lifespan;