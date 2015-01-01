const VanillaEventEmitter = require('events').EventEmitter;

class EventEmitter extends VanillaEventEmitter {
  within(lifespan) {
    const events = this;
    return {
      on(event, fn) {
        events.on(event, fn);
        lifespan.then(() => events.removeListener(event, fn));
        return this;
      }
    };
  }
}

module.exports = { EventEmitter };
