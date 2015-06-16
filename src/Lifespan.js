import _ from 'lodash';
const __DEV__ = process.env.NODE_ENV === 'development';

class Lifespan {
  // placeholder property
  static lifespan = null;

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
      return this;
    }
    this._released = true;
    _.each(this._callbacks, (fn) => fn());
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

  // set an interval that will be cleared upon release
  setInterval(fn, period) {
    if(__DEV__) {
      fn.should.be.a.Function;
      period.should.be.a.Number.which.is.not.below(0);
    }
    const i = setInterval(fn, period);
    this.onRelease(() => clearInterval(i));
    return this;
  }

  // set a timeout that will be cleared upon release
  setTimeout(fn, delay) {
    if(__DEV__) {
      fn.should.be.a.Function;
      delay.should.be.a.Number.which.is.not.below(0);
    }
    const i = setTimeout(fn, delay);
    this.onRelease(() => clearTimeout(i));
    return this;
  }

  // set an immediate that will be cleared upon release
  setImmediate(fn) {
    if(__DEV__) {
      fn.should.be.a.Function;
    }
    const i = setImmediate(fn);
    this.onRelease(() => clearImmediate(i));
    return this;
  }

  // sets a next animation frame callback  that will be cleared upon release
  requestAnimationFrame(fn) {
    if(__DEV__) {
      fn.should.be.a.Function;
    }
    const i = requestAnimationFrame(fn);
    this.onRelease(() => cancelAnimationFrame(i));
    return this;
  }

  // returns a Promise that will be resolved after release (deferred callback)
  Promise() {
    return new Promise((resolve) => this.onRelease(resolve));
  }

  // creates a new lifespan, which is released when any of the lifespans are released
  static race(...lifespans) {
    const r = new Lifespan();
    lifespans.forEach((lifespan) => lifespan.onRelease(r.release));
    return r;
  }

  // creates a new lifespan, which is released when all the lifespans are released
  static join(...lifespans) {
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

export default Lifespan;
