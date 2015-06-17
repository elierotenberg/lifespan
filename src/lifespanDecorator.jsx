import Lifespan from './Lifespan';
import should from 'should';
const __DEV__ = process.env.NODE_ENV === 'development';

function lifespan() {
  return (Component) => {
    if(__DEV__) {
      should(Component.prototype).not.have.property('getLifespan');
    }
    return class extends Component {
      getLifespan() {
        if(this._lifespan === void 0) {
          this._lifespan = new Lifespan();
        }
        return this._lifespan;
      }

      componentWillUnmount() {
        if(this._lifespan) {
          this._lifespan.release();
          this._lifespan = null;
        }
        if(super.componentWillUnmount) {
          super.componentWillUnmount();
        }
      }
    };
  };
}

export default lifespan;
