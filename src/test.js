const VanillaEventEmitter = require('events').EventEmitter;
const EventEmitter = require('../')(VanillaEventEmitter);

// life will end in 1000ms
const life = new Promise((resolve) => setTimeout(resolve, 1000));
const events = new EventEmitter();
let heartbeatCount = 0;
let breathCount = 0;
// 'within' is our new method. it returns an object with a chainable 'on' method
// which automactly unbinds listener when the promise is resolved
events.within(life) // bind events listeners that will only last
                    // as long as life is not resolved
.on('heartbeat', () => heartbeatCount = heartbeatCount + 1)
.on('breath', () => breathCount = breathCount + 1);

function heartbeat() { events.emit('heartbeat'); }
function breath() { events.emit('breath'); }
heartbeat();
const i = setInterval(heartbeat, 100);
breath();
const j = setInterval(breath, 200);

setTimeout(() => {
  heartbeatCount.should.be.exactly(10);
  breathCount.should.be.exactly(5);
  clearInterval(i);
  clearInterval(j);
}, 2000);

// instanceof works as expected
events.should.be.an.instanceOf(VanillaEventEmitter);
events.should.be.an.instanceOf(EventEmitter);
// VanillaEventEmitter prototype is left untouched
VanillaEventEmitter.should.not.be.exactly(EventEmitter);
VanillaEventEmitter.prototype.should.not.have.property('within');

