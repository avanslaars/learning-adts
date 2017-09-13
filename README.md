# Learning ADTs

Functional programming in JS has opened my mind to a new way of thinking about and solving problems. I've only just scratched the surface of what can be done and realize that I'm missing out on a great deal of power, flexibility and expressivity by not getting better acquainted with some common algebraic data types (or ADTs).

To learn more about my plan (or lack thereof) and goals, I've created an [about file that you can read here](./about.md).

## Examples/Notes

### Individual Types in the crocks lib

These examples all rely on ADTs found in the [crocks library](https://github.com/evilsoft/crocks).

#### Identity

[Detailed notes](./adts/Identity.md)

[samples source](./adts/Identity.js)

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
