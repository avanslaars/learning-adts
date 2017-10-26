'use strict'

const expect = require('chai').expect

const Maybe = require('crocks/maybe')
const { dbl, inc } = require('../utils')

/**
 * The Maybe type is a great way to safely handle values that may be
 * null or undefined and is one of the most basic ADTs that has practical application
 * all on its own
 */
describe('Maybe Construction', () => {
  /**
     * A Maybe instance will either have a value, wrapped in a Just container
     * or have no value and be represented by a Nothing
     */
  it('Creates a Just using the Maybe.of method', () => {
    const result = Maybe.of(3)
    expect(result.inspect()).to.eql('Just 3')
  })

  // Using `new Maybe` also works
  it('Creates a Just with new Maybe', () => {
    const result = new Maybe(3)
    expect(result.inspect()).to.eql('Just 3')
  })

  it('Allows us to create a Just directly', () => {
    const result = Maybe.Just(3)
    expect(result.inspect()).to.eql('Just 3')
  })

  it('Creates a Nothing with the zero method', () => {
    const result = Maybe.zero()
    expect(result.inspect()).to.eql('Nothing')
  })

  it('Allows us to create a Nothing directly', () => {
    const result = Maybe.Nothing()
    expect(result.inspect()).to.eql('Nothing')
  })
  /**
     * You might think null or undefined would automatically be converted to a Nothing
     * but this is not the case. The constructor doesn't come with any opinions. That's a good thing :)
     */
  it('Will create a Just null', () => {
    const justNull = Maybe.of(null)
    expect(justNull.inspect()).to.eql('Just null')
  })

  it('Will create a Just undefined', () => {
    const justNull = Maybe.of(undefined)
    expect(justNull.inspect()).to.eql('Just undefined')
  })
})

/**
   * To get back a Just or Nothing we can create a function and make the decision
   * ourselves, returning either a Just with the desired value or a Nothing
   */
describe('Maybe from a custom function', () => {
  // We can pull the Just and Nothing constructors out by destructuring Maybe
  const { Just, Nothing } = Maybe
  const getMaybe = value => (value ? Just(value) : Nothing())

  it('Returns a Nothing for null', () => {
    const maybeNull = getMaybe(null)
    expect(maybeNull.inspect()).to.eql('Nothing')
  })

  it('Returns a Nothing for undefined', () => {
    const maybeUndefined = getMaybe(undefined)
    expect(maybeUndefined.inspect()).to.eql('Nothing')
  })

  it('Returns a Just for a non-zero number', () => {
    const maybeFour = getMaybe(4) // Just 4
    expect(maybeFour.inspect()).to.eql('Just 4')
  })

  it('Returns a Nothing for 0', () => {
    const maybeZero = getMaybe(0)
    expect(maybeZero.inspect()).to.eql('Nothing')
  })

  it('Returns a Nothing for an empty string', () => {
    const maybeEmptyString = getMaybe('')
    expect(maybeEmptyString.inspect()).to.eql('Nothing')
  })

  it('Returns a Just for a non-empty string', () => {
    const maybeName = getMaybe('Bob')
    expect(maybeName.inspect()).to.eql('Just "Bob"')
  })

  /**
     * You get the idea... we can build functions that return Just or Nothing
     * based on whatever criteria we want.
     */
})

/**
   * We can accomplish the same thing we did with our custom function above
   * with the `safe` utility function provided by the crocks library.
   * `safe` takes a predicate function (a function that returns a bool) and a value
   * and returns a Just or Nothing based on evaluating that predicate against the value
   */
describe('Maybe using the `safe` utility function', () => {
  // const { safe } = crocks
  const safe = require('crocks/Maybe/safe')

  it('Returns a Nothing when the predicate evaluates to false', () => {
    const theMaybe = safe(Boolean, undefined)
    expect(theMaybe.inspect()).to.eql('Nothing')
  })

  it('Returns a Just with the value when the predicate evaluates to true', () => {
    const theMaybe = safe(Boolean, 'Something')
    expect(theMaybe.inspect()).to.eql('Just "Something"')
  })

  /**
     * And of course, `safe` is curried, so we can create a new function by passing it just
     * our predicate and then using that resulting function on multiple values
     */
  describe('curried safe', () => {
    const betweenOneAndTen = n => n >= 1 && n <= 10
    const maybeOneToTen = safe(betweenOneAndTen)

    it('Should be a Just', () => {
      const result = maybeOneToTen(5)
      expect(result.inspect()).to.eql('Just 5')
    })

    it('Should be a Nothing', () => {
      const result = maybeOneToTen(12)
      expect(result.inspect()).to.eql('Nothing')
    })
    /**
       * So as we can see here, it's pretty straightforward to get a Nothing
       * based on any value if our logic requires it.
       */
  })
})

/**
   * Now that we can make a maybe, let's see what we can do with them...
   * When getting a Maybe from a function, we won't know ahead of time
   * if it's a Just or a Nothing, so we need code that can handle either
   * scenario, and this is the entire point of the Maybe type
   */
describe('Maybe Methods', () => {
  describe('Maybe.map', () => {
    /**
       * map will unwrap our Maybe, apply the passed function to a value
       * and return the result as a Maybe. That is, in the case where we have
       * a value in the form of a Just.
       */
    const { Just, Nothing } = Maybe
    it('Will apply a function to a value in a Maybe & return a Maybe', () => {
      const maybeNumber = Just(3)
      const incDblMapped = maybeNumber.map(inc).map(dbl)
      expect(incDblMapped.inspect()).to.eql('Just 8')
    })

    /**
       * And what if we have a Nothing?
       * Well, we just get a Nothing back. No attempt is made to execute our functions...
       * when `map` is called on a Nothing, a Nothing is returned and the function is not executed
       */
    it('Will skip the function & return a Nothing if map is called on a Nothing', () => {
      const maybeNumber = Nothing()
      const incDblMapped = maybeNumber.map(inc).map(dbl)
      expect(incDblMapped.inspect()).to.eql('Nothing')
    })
  })

  describe('Maybe.chain', () => {
    /**
       * The `prop` function attempts to pull the value from a key on an object
       * If that key is present, you get a Just of the value, otherwise, Nothing
       */

    const safe = require('crocks/Maybe/safe')
    const prop = require('crocks/Maybe/prop')
    // Accept a value, return a maybe based on the predicate
    const maybeInRange = safe(val => val >= 25 && val <= 35)

    it('Allows you to create nested Maybes', () => {
      const inputObject = { name: 'Bob', age: 30 }
      const doubledIfInRange = prop('age', inputObject).map(maybeInRange)
      /**
         * That isn't a typo - the return value here is `Just Just 30`.
         * We have a Maybe wrapped in another Maybe
         */
      expect(doubledIfInRange.inspect()).to.eql('Just Just 30')
    })

    it('Can be flattened with chain', () => {
      const inputObject = { name: 'Bob', age: 30 }
      const doubledIfInRange = prop('age', inputObject).chain(maybeInRange)
      expect(doubledIfInRange.inspect()).to.eql('Just 30')
    })
  })

  describe('Maybe.option', () => {
    /**
       * We need to be able to get a value out of a Maybe.
       * To do this safely, we'll use `option`. This will accept
       * one argument which will be the default value that is
       * returned in the case of a Nothing.
       */
    it('Returns the value contained in a Just', () => {
      const maybeNumber = Maybe.Just(3)
      const result = maybeNumber.option(5)
      expect(result).to.equal(3)
    })

    it('Returns the default value for a Nothing', () => {
      const maybeNumber = Maybe.Nothing()
      const result = maybeNumber.option(5)
      expect(result).to.equal(5)
    })
  })

  describe('Maybe.either', () => {
    /**
       * Another approach for extracting the value from a Maybe
       * is with the `either` method. This method accepts two functions,
       * a "left" function and a "right" function. The left function will
       * be invoked in the case of a Nothing and the right will be
       * invoked for a Just. The right function will receive the value
       * contained in the Just as an argument. In either case, the
       * return value from the invoked function will be the value returned
       * from the call to `either`
       */
    it('Returns the value result of running the right fn on a Just', () => {
      const maybeNumber = Maybe.Just(3)
      const result = maybeNumber.either(
        () => 5, // not invoked for a Just
        n => n * 2 // Applies one final transformation to a Just
      )
      expect(result).to.equal(6)
    })

    it('Returns the value result of running the right fn on a Just', () => {
      const maybeNumber = Maybe.Nothing()
      const result = maybeNumber.either(
        () => 5, // returns a default value for a Nothing
        n => n * 2 // Doesn't get invoked for a Nothing
      )
      expect(result).to.equal(5)
    })
  })

  describe('Maybe.alt', () => {
    /**
     * The Maybe keeps our operations safe by skipping operations that might otherwise
     * throw an exception with a null or undefined value
     * That's great, what if we end up with a Nothing
     * and rather than lose out on an entire series of operations,
     * we'd like to continue our data processing with a default value
     * in those cases where we end up with a Nothing. The `alt` method
     * is one way to handle this situation
     */
    it('Provides a default Just for a Nothing', () => {
      const theNothing = Maybe.Nothing()
      const result = theNothing.alt(Maybe.Just(5))
      expect(result.inspect()).to.eql('Just 5')
    })

    it('Returns the original when called on a Just', () => {
      const theJust = Maybe.Just(3)
      const result = theJust.alt(Maybe.Just(5))
      expect(result.inspect()).to.eql('Just 3')
    })
  })
})

describe('Maybe.coalesce', () => {
  /**
   * The `alt` method is one way to "recover" in a situation where
   * We end up with a Nothing but we'd like a default Just so we can
   * continue processing via `map`s, `chain`s and the like.
   * The `coalesce` method gives us another way. This method is
   * like `either` in the fact that it takes a "left" and "right"
   * function as arguments. It runs the "left" for a Nothing and the
   * "right" is invoked with the value when there is a Just. The result
   * is a Just that contains the resulting value from whichever function
   * ends up being invoked.
   */
  it('Will put a value in Just for a Nothing', () => {
    const theNothing = Maybe.Nothing()
    const result = theNothing.coalesce(
      () => 'default value', // we get the default back as a Just
      str => str.toLowerCase()
    )
    expect(result.inspect()).to.equal('Just "default value"')
  })

  it('Will transform the Just', () => {
    const theJust = Maybe.Just('ALL CAPPED')
    const result = theJust.coalesce(
      () => 'default value',
      str => str.toLowerCase() // transform is run on our value
    )
    expect(result.inspect()).to.equal('Just "all capped"')
  })

  it('The identity function can be used to pass through the Just', () => {
    const identity = x => x
    const theNothing = Maybe.Just('ALL CAPPED')
    const result = theNothing.coalesce(() => 'default value', identity)
    expect(result.inspect()).to.equal('Just "ALL CAPPED"')
  })

  /**
   * The point here, is that we can continue processing after handling
   * a potential Nothing case and landing back in a Just state
   */
  it('We can continue processing from a Just', () => {
    const theJust = Maybe.Just('ALL CAPPED')
    const result = theJust
      .coalesce(() => 'default value', str => str.toLowerCase())
      .map(str => str.split(' '))
    expect(result.inspect()).to.equal('Just [ "all", "capped" ]')
  })

  it('We can continue processing from a Nothing', () => {
    const theNothing = Maybe.Nothing()
    const result = theNothing
      .coalesce(() => 'default value', str => str.toLowerCase())
      .map(str => str.split(' '))
    expect(result.inspect()).to.equal('Just [ "default", "value" ]')
  })
})
