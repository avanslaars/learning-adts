// @ts-check

describe('Combinators', () => {
  const { inc, dbl, sqr } = require('../utils')
  describe('applyTo', () => {
    const applyTo = require('crocks/combinators/applyTo')
    /**
     * applyTo takes a function as its first argument and returns the result of
     * applying that function to the second argument
     */
    it('Applies a function to a value', () => {
      const doubled = applyTo(dbl, 3)
      expect(doubled).toEqual(6)
    })

    /**
     * applyTo (like most functions in crocks) is automatically curried
     * so supplying just the first argument will return a new
     * function that is ready to accept the second argument
     */
    it('Is automatically curried', () => {
      const doubleNum = applyTo(dbl)
      expect(doubleNum).toBeInstanceOf(Function)

      const result = doubleNum(7)
      expect(result).toEqual(14)
    })
  })

  describe('composeB', () => {
      /**
       * composeB composes 2 functions from right to left
       * The code below is equivalent to:
       * const increased = inc(3) // 4
       * const result = dbl(increased) // 8
       *
       * or by composing the functions incline like:
       * const result = dbl(inc(3)) // 8
       */
    const composeB = require('crocks/combinators/composeB')
    it('Composes two functions', () => {
      const incThenDbl = composeB(dbl, inc)
      expect(incThenDbl).toBeInstanceOf(Function)
      const result = incThenDbl(3)
      expect(result).toEqual(8)
    })

      /**
       * You can compose with compositions too, though once you start doing this, you probably
       * just want to reach for the `compose` utility function
       */
    it('Composed functions can also be used in compositions', () => {
      const incDblSqr = composeB(sqr, composeB(dbl, inc))
      expect(incDblSqr).toBeInstanceOf(Function)
      const result2 = incDblSqr(2)
      expect(result2).toEqual(36)
    })
  })

  describe('constant', () => {
    const constant = require('crocks/combinators/constant')
    /**
     * constant takes a value and returns a function that
     * ignores any passed arguments and always returns that
     * initial value. This is called `always` in Ramda
     */
    it('Always returns the same value', () => {
      const alwaysThree = constant(3)
      expect(alwaysThree).toBeInstanceOf(Function)

      const result = alwaysThree('this argument will be ignored')
      expect(result).toEqual(3)
    })
  })

  describe('flip', () => {
    // crocks/combinators/flip
    const flip = require('crocks/combinators/flip')
    it('Flips the first two arguments', () => {
      const cat = (a, b, c) => `${a} ${b} ${c}`
      const catF = flip(cat)
      const result = cat('a', 'b', 'c')
      const resultF = catF('a', 'b', 'c')

      expect(result).toBe('a b c')
      expect(resultF).toBe('b a c')
    })
  })

  describe('identity', () => {
    const identity = require('crocks/combinators/identity')
    it('Just returns the value that was passed to it', () => {
      const value = 'A'
      const result = identity(value)
      expect(result).toBe(value)
    })
  })

  describe('reverseApply', () => {
    const reverseApply = require('crocks/combinators/reverseApply')
    it('Takes a value and returns a fn that takes a fn to be applied to the value', () => {
      const fn = reverseApply(1) // start with a value
      const result = fn(inc) // pass in a function to be applied
      expect(result).toBe(2) // get out the result
    })
  })

  describe('substitution', () => {
    // substitution : (a -> b -> c) -> (a -> b) -> a -> c
    const substitution = require('crocks/combinators/substitution')
    const {converge, identity} = require('ramda')
    it('Is similar to ramda converge using identity', () => {
      /**
       * `substitution(add, inc)` returns a function
       * When the fn is called, the value is 1st passed
       * to `inc`.
       * The value is also passed as the 1st arg to `add`, with the result of
       * the call to `inc`
       * This could easily be explained with some animated arrows or something
       * showing where the value goes
       */
      const inc = n => n + 1
      const add = (a, b) => a + b
      const subFn = substitution(add, inc)
      const result = subFn(1)
      expect(result).toBe(3)

      const conFn = converge(add, [identity, inc])
      const resultR = conFn(1)
      expect(resultR).toBe(3)
    })
  })
})
