/* eslint no-unused-expressions:0 */
'use strict'
// TODO: examples for: ap, bimap, swap
const expect = require('chai').expect

const crocks = require('crocks')
const { Pred } = crocks

describe('The Pred Mondad', () => {
  /**
   * I'm sure there is some magical application of this, but
   * right now, all I can see if a wrapper around a predicate
   * function. Maybe the secret is in functions like `contramap`?
   * This is what this type offers: concat, contramap, empty, runWith, value
   */
  it('Is like a wrapped predicate function', () => {
    const pred = new Pred(x => x > 10)
    const result = pred.runWith(15)
    expect(result).to.be.true
  })
})
