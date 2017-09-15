'use strict'

const expect = require('chai').expect
const crocks = require('crocks')

const { constant } = crocks

/**
 * constant takes a value and returns a function that
 * ignores any passed arguments and always returns that
 * initial value. This is called `always` in Ramda
 */
describe('constant combinator', () => {
  const alwaysThree = constant(3)
  expect(alwaysThree).to.be.instanceof(Function)

  const result = alwaysThree('this argument will be ignored')
  expect(result).to.eql(3)
})
