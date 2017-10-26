/* eslint no-unused-expressions:0 */
'use strict'
// TODO: examples for: ap, bimap, swap
const expect = require('chai').expect

const Async = require('crocks/async')
const R = require('ramda')

describe('Async Quick start', () => {
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
      // call rej for failure, res for success as appropriate
    })
    expect(task.inspect()).to.eq('Async Function')
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
      expect.fail() // test passes because this never executes
    })
    expect(task.inspect()).to.eq('Async Function')
  })

  it('Executes resolve fn when fork is called on resolved Async', () => {
    const successfulTask = new Async((rej, res) => {
      res('Hooray!')
    })
    // Other code can go here, lazy evaluation mean this task
    // will hang out and wait to be fired
    successfulTask.fork(
      () => expect.fail(), // this fires for a rejected task
      res => expect(res).to.eq('Hooray!')
    )
  })

  it('Executes rejected fn when fork is called on rejected Async', () => {
    const successfulTask = new Async((rej, res) => {
      rej('Boo!')
    })
    successfulTask.fork(err => expect(err).to.eq('Boo!'), res => expect.fail())
  })
})

describe('Async Construction', () => {
  it('Can be created as Resolved', () => {
    const task = Async.Resolved('Hooray!')
    task.fork(() => expect.fail(), res => expect(res).to.eq('Hooray!'))
  })

  it('Can be created as Rejected', () => {
    const task = Async.Rejected('Boo!')
    task.fork(err => expect(err).to.eq('Boo!'), () => expect.fail())
  })

  it('Can be created with the of method', () => {
    // Using `of` will create a Resolved Async
    const task = Async.of('Hooray!')
    task.fork(() => expect.fail(), res => expect(res).to.eq('Hooray!'))
  })

  it('Can handle multiple Asyncs with Async.all (success)', () => {
    /**
     * Multiple successful Asyncs will result in the resolve function
     * being invoked, receiving the results of each Async as an array
     * in the order the were passed into all
     */
    const task1 = Async.Resolved('Hooray 1!')
    const task2 = Async.Resolved('Hooray 2!')
    const allTask = Async.all([task1, task2])
    allTask.fork(
      () => expect.fail(),
      res => expect(res).to.eql(['Hooray 1!', 'Hooray 2!'])
    )
  })

  it('Can handle multiple Asyncs with Async.all (failure)', () => {
    const task1 = Async.Resolved('Hooray 1!')
    const task2 = Async.Resolved('Hooray 2!')
    const task3 = Async.Rejected('Boo!')
    const allTask = Async.all([task1, task2, task3])
    // A single failure will call the rejection function
    allTask.fork(err => expect(err).to.eq('Boo!'), () => expect.fail())
  })

  it('Can handle multiple Asyncs with Async.all (multiple failures)', () => {
    const task1 = Async.Resolved('Hooray 1!')
    const task2 = Async.Rejected('Boo 1!')
    const task3 = Async.Rejected('Boo 2!')
    const task4 = Async.Rejected('Boo 3!')
    const allTask = Async.all([task1, task2, task3, task4])
    /**
     * Multiple failures will result in the rejection function being
     * invoked with the last error being passed as the argument
     */
    allTask.fork(err => expect(err).to.eq('Boo 3!'), () => expect.fail())
  })

  it('Can be created from a function that returns a promise (success)', () => {
    const getPromise = val => new Promise((resolve, reject) => resolve(val))
    /**
     * Calling fromPromise returns a function that when invoked will
     * return an Async. When the async is forked, it will pass any arguments
     * into the promise-returning function. The promise will resolve or reject
     * and that will result in the Async being resolved or rejected
     */
    const taskFn = Async.fromPromise(getPromise)
    const task = taskFn('Hooray!')
    task.fork(() => expect.fail(), res => expect(res).to.eq('Hooray!'))
  })

  it('Can be created from a function that returns a promise (failure)', () => {
    const getPromise = () =>
      new Promise((resolve, reject) => reject(new Error('Oops!')))
    const taskFn = Async.fromPromise(getPromise)
    const task = taskFn()
    task.fork(
      err => {
        expect(err).to.be.instanceof(Error)
        expect(err.message).to.eq('Oops!')
      },
      () => expect.fail()
    )
  })

  it('Can be created from a CPS style function (success)', () => {
    const cpsFunction = (msg, cb) => cb(null, msg)
    const taskFn = Async.fromNode(cpsFunction)
    const task = taskFn('Hooray!')
    task.fork(() => expect.fail(), res => expect(res).to.eql('Hooray!'))
  })

  it('Can be created from a CPS style function (failure)', () => {
    const cpsFunction = (msg, cb) => cb(new Error('Oops!'))
    const taskFn = Async.fromNode(cpsFunction)
    const task = taskFn('Hooray!')
    task.fork(
      err => {
        expect(err).to.be.instanceof(Error)
        expect(err.message).to.eq('Oops!')
      },
      () => expect.fail()
    )
  })
})

describe('Asyncs can be converted to promises', () => {
  /**
   * Calling toPromise on an Async will result in a Promise.
   * Since promises are eager, we lose the advantages of lazy
   * evaluation and the underlying Async code is executed right away
   */
  it('Can be converted to a promise with toPromise', () => {
    const task = Async.Resolved('Hooray!')
    // No need for fork, converting makes it eager, as expected from a Promise
    task.toPromise().then(res => expect(res).to.eq('Hooray!'))
  })
})

describe('Asyncs can recover from Rejections with Async.alt', () => {
  /**
   * `alt` accepts an Async and when invoked on a Rejected, it will
   * simply return the provided Async as the new Async for the remainder
   * of the flow
   */
  it('Can turn a Rejected into a default Resolved', () => {
    const rejTask = Async.Rejected('👎')
    rejTask
      .alt(Async.Resolved('🎉'))
      .fork(() => expect.fail(), res => expect(res).to.eq('🎉'))
  })

  it('Can turn a Rejected into a default Resolved', () => {
    const rejTask = Async.Resolved('👍🏻')
    rejTask
      .alt(Async.Resolved('🎉')) // Not executed for a Resolved
      .fork(() => expect.fail(), res => expect(res).to.eq('👍🏻'))
  })
})

describe('Resolved Async values can be transformed with map', () => {
  it('Performs transformations on Resolved', () => {
    const task = Async.Resolved({ name: 'Bob' })
    task
      .map(R.prop('name'))
      .map(R.toUpper)
      .fork(() => expect.fail(), res => expect(res).to.eq('BOB'))
  })

  /**
   * We can cut multiple calls to `map` down by composing the
   * individual transform functions and mapping over the resulting function
   */
  it('Multiple maps can be consolidated with composition', () => {
    const task = Async.Resolved({ name: 'Bob' })
    task
      .map(R.compose(R.toUpper, R.prop('name')))
      .fork(() => expect.fail(), res => expect(res).to.eq('BOB'))
  })

  it('Ignores transformations on Rejected', () => {
    const task = Async.Rejected(new Error('Oops!'))
    task.map(R.prop('name')).map(R.toUpper).fork(
      err => {
        expect(err).to.be.instanceof(Error)
        expect(err.message).to.eq('Oops!')
      },
      () => expect.fail()
    )
  })
})

describe('Flatten nested Asyncs with Async.chain', () => {
  it('Does what it says in the describe ;)', () => {
    /**
     * We often need to get data asynchronously and then use part of
     * that data to get some other data asynchronously
     * If we did this in a `map`, we'd end up with nested Asyncs
     * So we use `chain` to flatten the structure
     */
    const outerTask = Async.Resolved('data needed for another call')
    outerTask
      .chain(res => Async.Resolved('data based on prev response'))
      .fork(
        () => expect.fail(),
        res => expect(res).to.eq('data based on prev response')
      )
  })
})

describe('Recover from errors with Async.coalesce', () => {
  it('Allows a rejected Async to be converted to a Resolved', () => {
    const task = Async.Rejected(new Error('Oops!'))
    task
      .coalesce(err => `Recovered from ${err.message}`, () => expect.fail())
      .fork(
        () => expect.fail(),
        res => expect(res).to.eq('Recovered from Oops!')
      )
  })

  it('Just runs the transformation when Resolved', () => {
    const task = Async.Resolved('success')
    task
      .coalesce(() => expect.fail(), res => res.toUpperCase())
      .fork(() => expect.fail(), res => expect(res).to.eq('SUCCESS'))
  })
})

describe('Switch Rejected and Resolved with swap', () => {
  it('Moves a Rejected to a Resolved', () => {
    const task = Async.Rejected(new Error('Oops!'))
    task
      .swap(err => err.message, () => expect.fail())
      .fork(() => expect.fail(), res => expect(res).to.eq('Oops!'))
  })

  it('Moves a Resolved to a Rejected', () => {
    const task = Async.Resolved('Faux Success')
    task.swap(() => expect.fail(), res => new Error(res)).fork(
      err => {
        expect(err).to.be.instanceof(Error)
        expect(err.message).to.eq('Faux Success')
      },
      () => expect.fail()
    )
  })
  /**
   * This doesn't make a ton of sense if you can't know ahead of time
   * if you're going to get a success that needs to become a Rejected...
   * So how do we do this in a useful way?
   */
  // TODO: Work out a reasonable way to use swap conditionally
  // Why would I use this instead of chaining with a ternary or
  // Just going from failure to success with `alt` or `coalesce`
})
