Lifespan
========


Reify the lifespan of an object, a component, whatever... Its really just like an never-failing Promise which executes its callback synchronously.

```js
const released = {};

released.a = false;
let count = 0;
const a = new Lifespan().onRelease(() => released.a = true);
const i = setInterval(() => count = count + 1, 1000);
a.onRelease(() => clearInterval(i));
released.b = false;
const b = new Lifespan();
b.onRelease(() => released.b = true);
setTimeout(b.release, 5500);
b.onRelease(() => a.release());

released.c1 = released.c2 = released.c3 = false;
const c1 = new Lifespan().onRelease(() => released.c1 = true);
const c2 = new Lifespan().onRelease(() => released.c2 = true);
const c3 = new Lifespan().onRelease(() => released.c3 = true);

released.c4 = false;
const c4 = Lifespan.race(c1, c2, c3).onRelease(() => released.c4 = true);
c1.release();
released.c4.should.be.true;

released.d1 = released.d2 = released.d3 = false;
const d1 = new Lifespan().onRelease(() => released.d1 = true);
const d2 = new Lifespan().onRelease(() => released.d2 = true);
const d3 = Lifespan.join(d1, d2).onRelease(() => released.d3 = true);
d1.release();
released.d3.should.be.false;
d2.release();
released.d3.should.be.true;

setTimeout(() => {
  released.a.should.be.false;
  count.should.be.exactly(2);
}, 2200);

setTimeout(() => {
  released.a.should.be.true;
  count.should.be.exactly(5);
}, 6000);
```

### Why not just use Promise?

Promise, when properly implemented (like `bluebird` does) are great. Really. But sometimes you just want to reifiy "something to call later", and these calls to be synchronous.

Thats where Lifespan comes handy.

### React Mixin

Lifespan comes with a ridiculously simple, yet very useful React component mixin. It adds the method `this.getLifespan()` to the component, which is released upon `componentWillUnmount`.
It is lazily initialized and memoized so that the lifespan instance is only created if needed, and created once per component.

### Use cases ?

EventEmitters, React Components, really anything when cleanup has to be performed at some point which is triggered manually.
