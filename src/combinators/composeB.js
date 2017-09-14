const crocks = require('crocks')

const { composeB } = crocks

const inc = n => n + 1
const dbl = n => n * 2
const sqr = n => n * n

/**
 * composeB composes 2 functions from right to left
 * The code below is equivalent to:
 * const increased = inc(3) // 4
 * const result = dbl(increased) // 8
 *
 * or by composing the functions incline like:
 * const result = dbl(inc(3)) // 8
 */
const incThenDbl = composeB(dbl, inc)
console.log(incThenDbl) // [Function]

const result = incThenDbl(3)
console.log(result) // 8

/**
 * You can compose with compositions too, though once you start doing this, you probably
 * just want to reach for the `compose` utility function
 */

// This is the same as `composeB(sqr, incThenDbl)` - using the existing composition from above
const incDblSqr = composeB(sqr, composeB(dbl, inc))
const result2 = incDblSqr(2)
console.log(result2) // 36
