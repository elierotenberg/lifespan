class Lifespan {
  constructor() {
    this._callbacks = [];
    this._released = false;
    _.bindAll(this);
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
      this._callbacks.push(fn);
    }
    return this;
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

export default Lifespan;
