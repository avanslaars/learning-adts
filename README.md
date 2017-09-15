# Learning ADTs

Functional programming in JS has opened my mind to a new way of thinking about and solving problems. I've only just scratched the surface of what can be done and realize that I'm missing out on a great deal of power, flexibility and expressivity by not getting better acquainted with some common algebraic data types (or ADTs).

## Project setup

I'm using `yarn` for this, so my suggested setup process is to clone this repo and run: `yarn` to install dependencies.

Many examples are created and executed in the context of unit tests. So you can see the output of the `.spec.js` files by running `yarn test`.

_These tests are **not** here to test the behavior of the libraries_, but as a convenient way to **show** the behavior with code that runs in a clean execution context. This way we avoid being inundated with log statements. This approach makes it easy to take advantage of tooling to help in an editor, run small pieces of the examples in isolation and to keep things organized. Also, the scoping of test functions means I can create the `result` constant as many times as I need to and don't need to come up with tons of names for things that are just there to help show an expected value. Sometimes, `result` is the right name in many places :)

This project's tests are using Mocha with Chai's expect assertions. There is also a `wallaby.js` that allows wallaby users to take full advantage of that editor integration.

To learn more about my plan (or lack thereof) and goals, I've created an [about file that you can read here](./about.md).

## Examples/Notes

### Individual Types in the crocks lib

These examples all rely on ADTs found in the [crocks library](https://github.com/evilsoft/crocks).

#### Identity

[Detailed notes](./adts/Identity.md)

[samples source](./adts/Identity.spec.js)

run: `node adts/Identity.js`

#### Maybe

[Detailed notes](./adts/Maybe.md)

[creating Maybes source](./adts/Maybe.js)

run creating: `node adts/Maybe.js`

[Maybe methods](./adts/MaybeMethods.js)

run methods: `node adts/MaybeMethods.js`

### Combinators

These examples rely on the combinators made available by [crocks](https://github.com/evilsoft/crocks)

#### applyTo

[samples source](./combinators/applyTo.js)

run: `node combinators/applyTo.js`

#### composeB

[samples source](./combinators/composeB.js)

run: `node combinators/composeB.js`

#### constant

[samples source](./combinators/constant.js)

run: `node combinators/constant.js`

#### flip

#### identity

#### reverseApply

#### substitution
