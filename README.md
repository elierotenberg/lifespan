<<<<<<< HEAD
Lifespan
--------

Mixin of EventEmitter (or similar API) which implements the concept of event binding within a lifespan.


## Example

```js
const VanillaEventEmitter = require('events').EventEmitter;
const EventEmitter = require('lifespan')(VanillaEventEmitter);

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

```

## Mixin with your own EventEmitter

Internally `within` is just API sugar (check the source code). You can mix it in with any EventEmitter implementation that implements `addListener(event, fn)` and `removeListener(event, fn)`.

`createMixin(OriginalEventEmitter)` returns a completely new class and won't modify the prototype of `OriginalEventEmitter`. However it will extend it using ES6' `extends` so `instanceof OriginalEventEmitter` will appropriately return `true` on instances of the mixin class.


You may also mixin an instance directly instead of mixing in a constructor. In this case, just use `wrap(instance)` and it will mixin the instance and return a chainable `this`:

```js
const { EventEmitter } = require('events');
const { wrap } = require('lifespan');
const events = wrap(new EventEmitter());
events.within(...)
```
=======
ES6 Starterkit
==============

The future is today!

#### Usage

1. Fork or clone this repository.
2. (Optional) Edit `package.json` if you intent to publish your package on `npm`.
3. `npm install` to install all the required dependencies from `npm`.
4. Hack `src/index.js`.
5. Build/rebuild using `gulp`.
6. Don't forget to edit this `README.md` file.

#### Features

- Sanely configured `gulpfile.js`, `package.json`, `.gitignore`, `.editorconfig` and `.jshintrc`.
- ES6 code from the `src` folder is transpiled into ES5 code in the `dist` folder via `6to5`.
- Both CommonJS and ES6 modules are supported.
- Several modules and variables are automatically injected in each module at transpile time. Check (and edit) `__prelude.js`.
- `__DEV__` and `__PROD__` are boolean constants reflecting `process.env.NODE_ENV`. Best friends with `envify` and `uglify`.
- `__BROWSER__` and `__NODE__` are boolean constants trying hard to reflect whether the code runs in the browser (via browserify/webpack) or in a NodeJS env.
- `bluebird` implementation of `Promise` is injected into global scope, since its is so neat and it outperforms native `Promise`.
- `should` is injected into each module, so you can do development-time assertions that are skipped in production, eg. `if(__DEV__) { n.should.be.a.Number; }`.
- `_` (`lodash`) is also injected into each module.

#### License

MIT [Elie Rotenberg](http://elie.rotenberg.io) <[elie@rotenberg.io](mailto:elie@rotenberg.io)>
>>>>>>> starterkit/master
