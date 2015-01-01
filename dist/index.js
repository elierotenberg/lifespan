"use strict";

var _inherits = function (child, parent) {
  child.prototype = Object.create(parent && parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (parent) child.__proto__ = parent;
};

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;var VanillaEventEmitter = require("events").EventEmitter;

var EventEmitter = (function () {
  var _VanillaEventEmitter = VanillaEventEmitter;
  var EventEmitter = function EventEmitter() {
    if (_VanillaEventEmitter) {
      _VanillaEventEmitter.apply(this, arguments);
    }
  };

  _inherits(EventEmitter, _VanillaEventEmitter);

  EventEmitter.prototype.within = function (lifespan) {
    var events = this;
    return {
      on: function (event, fn) {
        events.on(event, fn);
        lifespan.then(function () {
          return events.removeListener(event, fn);
        });
        return this;
      }
    };
  };

  return EventEmitter;
})();

module.exports = { EventEmitter: EventEmitter };