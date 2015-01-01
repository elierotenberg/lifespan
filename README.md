Lifespan
--------

Syntactic sugar over Promise to implement "lifespan" semantics. The underlying Promise is purposedly not rejectable.


## Example

```js
// create a new Lifespan object
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
lifespan.onDeath(() => events.removeListener('heartbeat', onHeartbeat));
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
```

## API

`new Lifespan(): new Lifespan`

Creates a new Lifespan object.

`get lifespan.dies: Promise`

Promise for the death of `lifespan`.

`lifespan.onDeath(fn: Function): Promise`

Alias for `lifespan.dies.then(fn)`. Returns the underlying Promise.

`lifespan.kill(): Promise`

Resolved the underlying promise and returns it (so that `lifespan.kill().then(fn)` produces `fn` to execute after all the previously attached callbacks).
