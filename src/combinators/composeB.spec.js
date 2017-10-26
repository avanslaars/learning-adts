'use strict'

const expect = require('chai').expect

const composeB = require('crocks/combinators/composeB')
const { inc, dbl, sqr } = require('../utils')

/**
 * composeB composes 2 functions from right to left
 * The code below is equivalent to:
 * const increased = inc(3) // 4
 * const result = dbl(increased) // 8
 *
 * or by composing the functions incline like:
 * const result = dbl(inc(3)) // 8
 */
describe('composeB combinator', () => {
  it('Composes two functions', () => {
    const incThenDbl = composeB(dbl, inc)
    expect(incThenDbl).to.be.instanceof(Function)
    const result = incThenDbl(3)
    expect(result).to.eql(8)
  })

  /**
   * You can compose with compositions too, though once you start doing this, you probably
   * just want to reach for the `compose` utility function
   */
  it('Composed functions can also be used in compositions', () => {
    const incDblSqr = composeB(sqr, composeB(dbl, inc))
    expect(incDblSqr).to.be.instanceof(Function)
    const result2 = incDblSqr(2)
    expect(result2).to.eql(36)
  })
})
