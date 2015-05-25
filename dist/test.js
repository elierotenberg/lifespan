'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

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

var released = {};

released.a = false;
var count = 0;
var a = new _3['default']().onRelease(function () {
  return released.a = true;
});
var i = setInterval(function () {
  return count = count + 1;
}, 1000);
a.onRelease(function () {
  return clearInterval(i);
});

released.b = false;
var b = new _3['default']();
b.onRelease(function () {
  return released.b = true;
});
setTimeout(b.release, 5500);
b.onRelease(function () {
  return a.release();
});

released.c1 = released.c2 = released.c3 = false;
var c1 = new _3['default']().onRelease(function () {
  return released.c1 = true;
});
var c2 = new _3['default']().onRelease(function () {
  return released.c2 = true;
});
var c3 = new _3['default']().onRelease(function () {
  return released.c3 = true;
});

released.c4 = false;
var c4 = _3['default'].race(c1, c2, c3).onRelease(function () {
  return released.c4 = true;
});
c1.release();
released.c4.should.be['true'];
void c4;

released.d1 = released.d2 = released.d3 = false;
var d1 = new _3['default']().onRelease(function () {
  return released.d1 = true;
});
var d2 = new _3['default']().onRelease(function () {
  return released.d2 = true;
});
var d3 = _3['default'].join(d1, d2).onRelease(function () {
  return released.d3 = true;
});
d1.release();
released.d3.should.be['false'];
d2.release();
released.d3.should.be['true'];
void d3;

setTimeout(function () {
  released.a.should.be['false'];
  count.should.be.exactly(2);
}, 2200);

setTimeout(function () {
  released.a.should.be['true'];
  count.should.be.exactly(5);
}, 6000);