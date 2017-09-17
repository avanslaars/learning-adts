/* eslint no-unused-expressions:0 */
'use strict'
// TODO: examples for:
const expect = require('chai').expect

const crocks = require('crocks')
const { Async } = crocks
// const { dbl, inc } = require('../utils')

describe('Async Quickstart', () => {
  /**
   * We can create an Async by passing a function to the constructor
   * This function accepts two functions as arguments, a rejection
   * function, to be called if the async task fails and a resolve function
   * to be called when the async task has completed successfully
   * This is similar to the native `Promise` constructor except the order
   * of functions is reversed. Another BIG difference is that an Async is lazy
   */
  it('Allows construction with the new keyword and a function', () => {
    const task = new Async((rej, res) => {
      res('success')
    })
    expect(task.inspect()).to.eql('Async Function')
  })

  it('Async evaluation is lazy!', () => {
    /**
     * There is an explicit fail() in the function passed to the Async
     * constructor. This is still a passing test. The reason is that
     * Async, unlike a Promise is lazy. It won't be executed until
     * the `fork` method is called. In this case, we've defined the
     * Async, but we haven't called fork. This is a good thing!
     * If our Async task calls an API, but only needs to run on
     * a certain branch of our logic, there is no sense in making
     * those API calls. Lazy evaluation will make our code more efficient
     */
    const task = new Async((rej, res) => {
      res('success')
      expect.fail() // test passes because this never executes
    })
    expect(task.inspect()).to.eql('Async Function')
  })
})
