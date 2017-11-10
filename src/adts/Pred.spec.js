/* eslint no-unused-expressions:0 */
'use strict'
// TODO: examples for: ap, bimap, swap
const expect = require('chai').expect

const Pred = require('crocks/pred')

describe('The Pred Mondad', () => {
  /**
   * I'm sure there is some magical application of this, but
   * right now, all I can see if a wrapper around a predicate
   * function. Maybe the secret is in functions like `contramap`?
   * This is what this type offers: concat, contramap, empty, runWith, value
   */
  it('Is like a wrapped predicate function', () => {
    const pred = new Pred(x => x > 10)
    const result1 = pred.runWith(15)
    const result2 = pred.runWith(5)
    expect(result1).to.be.true
    expect(result2).to.be.false
  })
})
