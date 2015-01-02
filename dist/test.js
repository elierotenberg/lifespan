"use strict";

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;var VanillaEventEmitter = require("events").EventEmitter;
var EventEmitter = require("../")(VanillaEventEmitter);

// life will end in 1000ms
var life = new Promise(function (resolve) {
  return setTimeout(resolve, 1000);
});
var events = new EventEmitter();
var heartbeatCount = 0;
var breathCount = 0;
// 'within' is our new method. it returns an object with a chainable 'on' method
// which automactly unbinds listener when the promise is resolved
events.within(life) // bind events listeners that will only last
// as long as life is not resolved
.on("heartbeat", function () {
  return heartbeatCount = heartbeatCount + 1;
}).on("breath", function () {
  return breathCount = breathCount + 1;
});

function heartbeat() {
  events.emit("heartbeat");
}
function breath() {
  events.emit("breath");
}
heartbeat();
var i = setInterval(heartbeat, 100);
breath();
var j = setInterval(breath, 200);

setTimeout(function () {
  heartbeatCount.should.be.exactly(10);
  breathCount.should.be.exactly(5);
  clearInterval(i);
  clearInterval(j);
}, 2000);

// instanceof works as expected
events.should.be.an.instanceOf(VanillaEventEmitter);
events.should.be.an.instanceOf(EventEmitter);
// VanillaEventEmitter prototype is left untouched
VanillaEventEmitter.should.not.be.exactly(EventEmitter);
VanillaEventEmitter.prototype.should.not.have.property("within");