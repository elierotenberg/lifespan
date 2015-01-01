"use strict";

require("6to5/polyfill");var _ = require("lodash");var should = require("should");var Promise = (global || window).Promise = require("bluebird");var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;__DEV__ ? Promise.longStackTraces() : void 0;var Lifespan = require("../");

var EventEmitter = Lifespan.EventEmitter;

// life will end in 1000ms
var life = new Promise(function (resolve) {
  return setTimeout(resolve, 1000);
});
var events = new EventEmitter();
var hearthbeatCount = 0;
var breathCount = 0;
events.within(life) // bind events listeners that will only last
// as long as life is not resolved
.on("heartbeat", function () {
  return hearthbeatCount = hearthbeatCount + 1;
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
  hearthbeatCount.should.be.exactly(10);
  breathCount.should.be.exactly(5);
  clearInterval(i);
  clearInterval(j);
}, 2000);