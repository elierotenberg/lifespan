const _setInterval = global.setInterval;
const _setTimeout = global.setTimeout;
const _setImmediate = global.setImmediate;
const _Promise = global.Promise;
const _requestAnimationFrame = global.requestAnimationFrame;

import Mixin from './Mixin';

class Lifespan {
  constructor() {
    this._callbacks = [];
    this._released = false;
    _.bindAll(this, [
      'release',
      'onRelease',
      'setInterval',
      'setTimeout',
      'setImmediate',
      'requestAnimationFrame',
      'Promise',
    ]);
  }

  release() {
    if(this._released) {
      return;
    }
    this._released = true;
    this._callbacks.forEach((fn) => fn());
    this._callbacks = null;
    return this;
  }

  onRelease(fn) {
    if(this._released) {
      fn();
    }
    else {
      this._callbacks.unshift(fn);
    }
    return this;
  }

  setInterval(fn, period) { // set an interval that will be cleared upon release
    if(__DEV__) {
      fn.should.be.a.Function;
      period.should.be.a.Number.which.is.not.below(0);
    }
    const i = _setInterval(fn, period);
    this.onRelease(() => clearInterval(i));
    return this;
  }

  setTimeout(fn, delay) { // set a timeout that will be cleared upon release
    if(__DEV__) {
      fn.should.be.a.Function;
      delay.should.be.a.Number.which.is.not.below(0);
    }
    const i = _setTimeout(fn, delay);
    this.onRelease(() => clearTimeout(i));
    return this;
  }

  setImmediate(fn) { // set an immediate that will be cleared upon release
    if(__DEV__) {
      fn.should.be.a.Function;
    }
    const i = _setImmediate(fn);
    this.onRelease(() => clearImmediate(i));
    return this;
  }

  requestAnimationFrame(fn) { // sets a next animation frame callback  that will be cleared upon release
    if(__DEV__) {
      fn.should.be.a.Function;
    }
    const i = _requestAnimationFrame(fn);
    this.onRelease(() => cancelAnimationFrame(i));
    return this;
  }

  Promise() { // returns a Promise that will be resolved after release (deferred callback)
    return new _Promise((resolve) => this.onRelease(resolve));
  }

  static race(...lifespans) { // creates a new lifespan, which is released when any of the lifespans are released
    const r = new Lifespan();
    lifespans.forEach((lifespan) => lifespan.onRelease(r.release));
    return r;
  }

  static join(...lifespans) { // creates a new lifespan, which is released when all the lifespans are released
    let countDown = lifespans.length;
    const r = new Lifespan();
    lifespans.forEach((lifespan) => lifespan.onRelease(() => {
      countDown = countDown - 1;
      if(countDown === 0) {
        r.release();
      }
    }));
    return r;
  }
}

Lifespan.Mixin = Mixin(Lifespan);

export default Lifespan;
