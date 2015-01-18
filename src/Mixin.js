import Lifespan from '../';

const Mixin = {
  _lifespan: null,

  get lifespan() {
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
};

export default Mixin;
