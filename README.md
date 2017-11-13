# Learning ADTs

Functional programming in JS has opened my mind to a new way of thinking about and solving problems. I've only just scratched the surface of what can be done and realize that I'm missing out on a great deal of power, flexibility and expressivity by not getting better acquainted with some common algebraic data types (or ADTs).

## Project setup

I'm using `yarn` for this, so my suggested setup process is to clone this repo and run: `yarn` to install dependencies.

All examples (so far) are created and executed in the context of unit tests. So you can see the output of the `.spec.js` files by running `yarn test`.

**These tests are not here to test the behavior of the libraries in use**!

Unit tests are a convenient way to **show** the behavior with code that runs in a clean execution context. This way we can create simple, small examples and avoid being inundated with log statements.

This approach makes it easy to take advantage of tooling to help in an editor, run small pieces of the examples in isolation and to keep things organized. Also, the scoping of test functions means I can use common names like `result` in as many places as I need to... **naming things is hard** :)

This project's tests are using Mocha with Chai's expect assertions. There is also a `wallaby.js` file that allows wallaby users to take full advantage of that editor integration.

To learn more about my plan (or lack thereof) and goals, I've created an [about file that you can read here](./about.md).

## Examples/Notes

### Individual Types in the crocks lib

These examples all rely on ADTs found in the [crocks library](https://github.com/evilsoft/crocks).

The order of the types listed here is subject to change. It is intended to be in the order I would teach these in. That may change with a new type being inserted between two previously listed types once I learn it better... that just means I would teach this differently based on new information. As this is an ongoing learning exercise, this order is likely to change periodically as I learn more.

#### Maybe

I originally thought I would teach the `Identity` first in a class or workshop, but I think `Maybe` is a better starting point. It's not quite as simple, but its utility is far more apparent and demonstrates the value of these types in a very obvious way.

[Detailed notes](./src/adts/Maybe.md)

[samples source](./src/adts/Maybe.spec.js)
#### Identity

[Detailed notes](./src/adts/Identity.md)

[samples source](./src/adts/Identity.spec.js)

#### Either

[samples source](./src/adts/Either.spec.js)
#### Pair

[samples source](./src/adts/Pair.spec.js)
#### Async

[samples source](./src/adts/Async.spec.js)

#### Pred

[samples source](./src/adts/Pred.spec.js)

### Combinators

These examples rely on the combinators made available by [crocks](https://github.com/evilsoft/crocks)

[samples source](./src/combinators/index.spec.js)

### Helpers

These examples are all for helper functions in [crocks](https://github.com/evilsoft/crocks)

[samples source](./src/helpers/index.spec.js)
