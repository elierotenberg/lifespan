class Lifespan {
  constructor() {
    this._promise = new Promise((resolve, reject) => this._resolve = resolve || reject);
  }

  kill() {
    this._resolve();
    return this._promise;
  }

  get dies() {
    return this._promise;
  }

  onDeath(fn) {
    return this.death.then(fn);
  }
}

Object.assign(Lifespan.prototype, {
  _promise: null,
  _resolve: null,
});

module.exports = Lifespan;
