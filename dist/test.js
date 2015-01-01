"use strict";

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;var Lifespan = require("../");
var _ref = require("events");

var EventEmitter = _ref.EventEmitter;


// create a new Lifespan object
var lifespan = new Lifespan();
var callCount = 0;
function onHeartbeat() {
  callCount = callCount + 1;
  console.log("I am still alive", callCount);
}
var events = new EventEmitter();

events.addListener("heartbeat", onHeartbeat);
// whenever lifespan dies,
lifespan.dies.then(function () {
  return events.removeListener("heartbeat", onHeartbeat);
});
// alternatively
// start beating
events.emit("heartbeat");
var i = setInterval(function () {
  return events.emit("heartbeat");
}, 100);
// kill the lifespan in 1000ms
setTimeout(function () {
  return lifespan.kill();
}, 1000);

// check that the handler has been called exactly 10 times
setTimeout(function () {
  callCount.should.be.exactly(10);
  clearInterval(i);
}, 2000);