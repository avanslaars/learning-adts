// @ts-check
'use strict'
// TODO: examples for: ap, concat, either, equals, sequence, swap, traverse

describe('Either', () => {
  const Either = require('crocks/either')
  const identity = require('crocks/combinators/identity')
  const { dbl, inc } = require('../utils')

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
      expect(result.inspect()).toEqual('Right 3')
    })

    // Using `new Either` also works
    it('Creates a Right with new Either', () => {
      const result = new Either(3)
      expect(result.inspect()).toEqual('Right 3')
    })

    it('Allows us to create a Right directly', () => {
      const result = Either.Right(3)
      expect(result.inspect()).toEqual('Right 3')
    })

    it('Allows us to create a Left directly', () => {
      const result = Either.Left('error')
      expect(result.inspect()).toEqual('Left "error"')
    })
    /**
       * You might think null or undefined would automatically be converted to a Nothing
       * but this is not the case. The constructor doesn't come with any opinions. That's a good thing :)
       */
    it('Will create a Right null', () => {
      const result = Either.of(null)
      expect(result.inspect()).toEqual('Right null')
    })

    it('Will create a Right undefined', () => {
      const result = Either.of(undefined)
      expect(result.inspect()).toEqual('Right undefined')
    })
  })

  describe('Mapping and Chaining Eithers', () => {
    it('Runs transformations on a Right', () => {
      const theRight = Either.of(3)
      const result = theRight.map(inc).map(dbl)
      expect(result.inspect()).toEqual('Right 8')
    })

    it('Ignores transformations on a Left', () => {
      const theLeft = Either.Left(3)
      const result = theLeft.map(inc).map(dbl)
      expect(result.inspect()).toEqual('Left 3')
    })

    it('Will nest Eithers', () => {
      const theRight = Either.of(3)
      // Return the result wrapped in an Either for demo
      const dblEither = n => Either.of(n * 2)
      const result = theRight.map(dblEither)
      expect(result.inspect()).toEqual('Right Right 6')
    })

    it('Nested Eithers can be flattened with chain', () => {
      const theRight = Either.of(3)
      const dblEither = n => Either.of(n * 2)
      const result = theRight.chain(dblEither)
      expect(result.inspect()).toEqual('Right 6') // only one Right deep
    })

    it('Chain will also ignore Lefts', () => {
      const theLeft = Either.Left(3)
      const dblEither = n => Either.of(n * 2)
      const result = theLeft.chain(dblEither)
      expect(result.inspect()).toEqual('Left 3')
    })
  })

  describe('Define transformations for Left and Right with bimap', () => {
    it('Will transform a Left', () => {
      const theLeft = Either.Left('err')
      const result = theLeft.bimap(str => str.toUpperCase(), identity)
      expect(result.inspect()).toEqual('Left "ERR"')
    })

    it('Will transform a Right', () => {
      const theRight = Either.Right('name')
      const result = theRight.bimap(identity, str => str.toUpperCase())
      expect(result.inspect()).toEqual('Right "NAME"')
    })
  })

  describe('Recovering from error states with alt and coalesce', () => {
    it('Alt allows a default to replace a Left', () => {
      const theLeft = Either.Left('err')
      const result = theLeft.alt(Either.Right('default'))
      expect(result.inspect()).toEqual('Right "default"')
    })

    it('Alt does not replace the value in the case of a Right', () => {
      const theRight = Either.Right('success')
      const result = theRight.alt(Either.Right('default'))
      expect(result.inspect()).toEqual('Right "success"')
    })

    it('Alt allows the default to be a Left', () => {
      const theLeft = Either.Left('err')
      // Less likely, but you may just want to replace the Left with your own Left value
      const result = theLeft.alt(Either.Left('different Left'))
      expect(result.inspect()).toEqual('Left "different Left"')
    })

    it('Coalesce allows you to transform your Left and make it the Right', () => {
      const theLeft = Either.Left('err')
      const result = theLeft.coalesce(str => str.toUpperCase(), identity)
      expect(result.inspect()).toEqual('Right "ERR"')
    })

    it('Coalesce will transform a Right and leave it as a Right', () => {
      const theRight = Either.Right('Name')
      const result = theRight.coalesce(identity, str => str.toUpperCase())
      expect(result.inspect()).toEqual('Right "NAME"')
    })
  })
})
