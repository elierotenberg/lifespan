export default (Lifespan) => ({
  _lifespan: null,

  getLifespan() {
    if(!this._lifespan) {
      this._lifespan = new Lifespan();
    }
    return this._lifespan;
  },

  componentWillUnmount() {
    if(this._lifespan) {
      this._lifespan.release();
      this._lifespan = null;
    }
  },
});
