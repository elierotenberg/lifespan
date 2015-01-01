Lifespan
--------

Extension of EventEmitter which implements the concept of event binding within a lifespan.


## Example

```js
const EventEmitter = Lifespan.EventEmitter;

// life will end in 1000ms
const life = new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
const events = new EventEmitter();
let hearthbeatCount = 0;
let breathCount = 0;
// 'within' is our new method. it returns an object with a chainable 'on' method
// which automactly unbinds listener when the promise is resolved
events.within(life) // bind events listeners that will only last
                    // as long as life is not resolved
.on('heartbeat', () => hearthbeatCount = hearthbeatCount + 1)
.on('breath', () => breathCount = breathCount + 1);

function heartbeat() { events.emit('heartbeat'); }
function breath() { events.emit('breath'); }
heartbeat();
const i = setInterval(heartbeat, 100);
breath();
const j = setInterval(breath, 200);

setTimeout(() => {
  hearthbeatCount.should.be.exactly(10);
  breathCount.should.be.exactly(5);
  clearInterval(i);
  clearInterval(j);
}, 2000);
```
