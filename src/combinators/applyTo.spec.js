'use strict'

const expect = require('chai').expect
const crocks = require('crocks')

const { applyTo } = crocks

const { dbl } = require('../utils')

describe('applyTo', () => {
  /**
   * applyTo takes a function as its first argument and returns the result of
   * applying that function to the second argument
   */
  it('Applies a function to a value', () => {
    const doubled = applyTo(dbl, 3)
    expect(doubled).to.eql(6)
  })

  /**
   * applyTo (like most functions in crocks) is automatically curried
   * so supplying just the first argument will return a new
   * function that is ready to accept the second argument
   */
  it('Is automatically curried', () => {
    const doubleNum = applyTo(dbl)
    expect(doubleNum).to.be.instanceof(Function)

    const result = doubleNum(7)
    expect(result).to.eql(14)
  })
})
