'use strict'

const expect = require('chai').expect

const crocks = require('crocks')
const { Either } = crocks
// const { dbl, inc } = require('../utils')

/**
 * The Either type is a great way to handle values where
 * there may be a "correct" or "incorrect" value, or a value
 * and an error. The Either allows our control code to branch
 * and handle each case properly with most operations favoring the
 * "correct" value.
 * The Either consists of a Left container (conventionally this is
 * the error or "incorrect" case) or a Right container (the "correct"
 * and therefore, the favored value).
 */
describe('Either Construction', () => {
  it('Creates a Right using the Either.of method', () => {
    const result = Either.of(3)
    expect(result.inspect()).to.eql('Right 3')
  })

  // Using `new Either` also works
  it('Creates a Right with new Either', () => {
    const result = new Either(3)
    expect(result.inspect()).to.eql('Right 3')
  })

  it('Allows us to create a Right directly', () => {
    const result = Either.Right(3)
    expect(result.inspect()).to.eql('Right 3')
  })

  it('Allows us to create a Left directly', () => {
    const result = Either.Left('error')
    expect(result.inspect()).to.eql('Left "error"')
  })
  /**
     * You might think null or undefined would automatically be converted to a Nothing
     * but this is not the case. The constructor doesn't come with any opinions. That's a good thing :)
     */
  it('Will create a Right null', () => {
    const result = Either.of(null)
    expect(result.inspect()).to.eql('Right null')
  })

  it('Will create a Right undefined', () => {
    const result = Either.of(undefined)
    expect(result.inspect()).to.eql('Right undefined')
  })
})
