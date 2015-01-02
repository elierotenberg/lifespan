function within(lifespan) {
  const events = this;
  if(__DEV__) {
    lifespan.should.have.property('then').which.is.a.Function;
  }
  return {
    on(event, fn) {
      events.addListener(event, fn);
      lifespan.then(() => events.removeListener(event, fn));
      return this;
    }
  };
}

function createMixin(EventEmitterImplementation) {
  if(__DEV__) {
    EventEmitterImplementation.prototype.should.have.property('addListener').which.is.a.Function;
    EventEmitterImplementation.prototype.should.have.property('removeListener').which.is.a.Function;
  }
  class Mixin extends EventEmitterImplementation { }
  Object.assign(Mixin.prototype, { within });
  return Mixin;
}

module.exports = createMixin;
