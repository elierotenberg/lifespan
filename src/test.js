const Lifespan = require('../');
const { EventEmitter } = require('events');

// create a new Lifespan object
let lifespan = new Lifespan();
let callCount = 0;
function onHeartbeat() {
  callCount = callCount + 1;
  console.log('I am still alive', callCount);
}
let events = new EventEmitter();

events.addListener('heartbeat', onHeartbeat);
// whenever lifespan dies,
lifespan.dies.then(() => events.removeListener('heartbeat', onHeartbeat));
// alternatively
// start beating
events.emit('heartbeat');
let i = setInterval(() => events.emit('heartbeat'), 100);
// kill the lifespan in 1000ms
setTimeout(() => lifespan.kill(), 1000);

// check that the handler has been called exactly 10 times
setTimeout(() => {
  callCount.should.be.exactly(10);
  clearInterval(i);
}, 2000);
