'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}

exports['default'] = function (Lifespan) {
  return {
    _lifespan: null,

    getLifespan: function getLifespan() {
      if (!this._lifespan) {
        this._lifespan = new Lifespan();
      }
      return this._lifespan;
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this._lifespan) {
        this._lifespan.release();
        this._lifespan = null;
      }
    }
  };
};

module.exports = exports['default'];