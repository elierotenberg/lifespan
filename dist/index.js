"use strict";

<<<<<<< HEAD
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

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;function within(lifespan) {
  var events = this;
  if (__DEV__) {
    lifespan.should.have.property("then").which.is.a.Function;
  }
  return {
    on: function (event, fn) {
      events.addListener(event, fn);
      lifespan.then(function () {
        return events.removeListener(event, fn);
      });
      return this;
    }
  };
}

function createMixin(EventEmitterImplementation) {
  if (__DEV__) {
    EventEmitterImplementation.prototype.should.have.property("addListener").which.is.a.Function;
    EventEmitterImplementation.prototype.should.have.property("removeListener").which.is.a.Function;
  }
  var Mixin = (function () {
    var _EventEmitterImplementation = EventEmitterImplementation;
    var Mixin = function Mixin() {
      if (_EventEmitterImplementation) {
        _EventEmitterImplementation.apply(this, arguments);
      }
    };

    _inherits(Mixin, _EventEmitterImplementation);

    return Mixin;
  })();

  Object.assign(Mixin.prototype, { within: within });
  return Mixin;
}

module.exports = createMixin;
=======
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
}
>>>>>>> starterkit/master
