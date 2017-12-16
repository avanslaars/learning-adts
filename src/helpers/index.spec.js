// @ts-check
/* eslint no-unused-expressions:0 */
const expect = require('chai').expect
const sinon = require('sinon')
const {inc, dbl, sqr} = require('../utils')

// crocks/helpers/branch a -> Pair a a

describe('Crocks helpers', () => {
  context('assign', () => {
    const assign = require('crocks/helpers/assign')
    it('merges two objects', () => {
      const obj1 = {a: 'A', b: 'B'}
      const obj2 = {c: 'C', d: 'D'}
      const expected = {a: 'A', b: 'B', c: 'C', d: 'D'}
      const result = assign(obj1, obj2)
      expect(result).to.eql(expected)
    })

    it('merges two objects, favoring values in the 1st obj for shared keys', () => {
      const obj1 = {a: 'A', b: 'B'}
      const obj2 = {b: 'Other B', c: 'C', d: 'D'}
      const expected = {a: 'A', c: 'C', d: 'D', b: 'Other B'}
      const result = assign(obj2, obj1)
      expect(result).to.eql(expected)
    })
  })

  context('assoc', () => {
    const assoc = require('crocks/helpers/assoc')

    it('Creates a new object by attaching the new property to the input object', () => {
      const input = {a: 'A'}
      const expected = {a: 'A', b: 'B'}
      const result = assoc('b', 'B', input)
      expect(result).to.eql(expected)
    })

    it('Changes the value of an existing property in the new object', () => {
      const input = {a: 'A', b: 'x'}
      const expected = {a: 'A', b: 'B'}
      const result = assoc('b', 'B', input)
      expect(result).to.eql(expected)
    })
  })

  context('binary', () => {
    const binary = require('crocks/helpers/binary')
    const cat3 = (a, b, c) => `${a || ''} ${b || ''} ${c || ''}`.trim()

    it('returns a function with an arity of 2', () => {
      const cat2 = binary(cat3)

      const result3 = cat3('a', 'b', 'c')
      const result2 = cat2('a', 'b', 'c')

      expect(result3).to.equal('a b c')
      expect(result2).to.equal('a b')
    })

    it('returns a curried function', () => {
      const cat2 = binary(cat3)

      const result1 = cat2('a', 'b')
      const result2 = cat2('a')('b')

      expect(result1).to.equal('a b')
      expect(result2).to.equal('a b')
    })
  })

  context('compose', () => {
    const compose = require('crocks/helpers/compose')
    it('composes two functions', () => {
      const incDbl = compose(dbl, inc)
      const result = incDbl(1)
      expect(result).to.equal(4)
    })

    it('composes three functions', () => {
      const incDblSqr = compose(sqr, dbl, inc)
      const result = incDblSqr(1)
      expect(result).to.equal(16)
    })
  })

  context('composeK', () => {
    const composeK = require('crocks/helpers/composeK')
    const compose = require('crocks/helpers/compose')
    const chain = require('crocks/pointfree/chain')
    const identity = require('crocks/combinators/identity')
    const safe = require('crocks/Maybe/safe')
    const prop = require('crocks/Maybe/prop')

    /**
     * If you are dot-chaining or composing operations where you need to flatten
     * types with `chain`, you can get the result with all 3 approaches below:
     * Fluent (dot-chain), composition with each operation wrapped in `chain` or
     * you can reach for `composeK` which internally takes care of wiring up the
     * `chain` for you.
     */
    it('Composes chainable types', () => {
      const data = {a: {b: {c: 'Here it is!'}}}
      const fluent = x =>
        safe(Boolean, x)
          .chain(prop('a'))
          .chain(prop('b'))
          .chain(prop('c'))

      const fluentResult = fluent(data).either(identity, identity)

      const pointFree = compose(
        chain(prop('c')),
        chain(prop('b')),
        chain(prop('a')),
        safe(Boolean)
      )

      const pointFreeResult = pointFree(data).either(identity, identity)

      const kleisli = composeK(
        prop('c'),
        prop('b'),
        prop('a'),
        safe(Boolean)
      )
      const kleisliResult = kleisli(data).either(identity, identity)

      // All of these produce the same result
      expect(fluentResult).to.eql(pointFreeResult)
      expect(kleisliResult).to.eql(fluentResult)
      expect(kleisliResult).to.eql(pointFreeResult)
    })
  })

  context('composeP', () => {
    const composeP = require('crocks/helpers/composeP')
    it('composes promise returning function', () => {
      const getP1 = x => {
        return new Promise((resolve, reject) => {
          resolve(`${x} - 1`)
        })
      }
      const getP2 = x => {
        return new Promise((resolve, reject) => {
          resolve(`${x} - 2`)
        })
      }
      const getP3 = x => {
        return new Promise((resolve, reject) => {
          resolve(`${x} - 3`)
        })
      }

      const chainFn = x =>
        getP1(x)
          .then(getP2)
          .then(getP3)

      const compFn = composeP(getP3, getP2, getP1)
      const result1 = chainFn('x')
      const result2 = compFn('x')
      Promise.all([result1, result2])
        .then(([one, two]) => {
          // x - 1 - 2 - 3
          expect(one).to.eql(two)
        })
    })
  })

  // TODO: composeS

  context('curry', () => {
    const curry = require('crocks/helpers/curry')
    it('curries an uncurried function', () => {
      const add = (a, b) => a + b
      const addC = curry(add)
      const result1 = addC(1, 2)
      const result2 = addC(1)(2)
      expect(result1).to.equal(result2)
    })
  })

  context('defaultProps', () => {
    const defaultProps = require('crocks/helpers/defaultProps')
    it('Assigns defaults to multiple keys', () => {
      const input = {
        a: 'Here',
        d: 'Also here'
      }
      const theDefaults = {
        a: 'Default A',
        b: 'Default B',
        c: 'Default C'
      }
      /**
       * Uses the `a` & keeps the `d`, provides defaults for `b` and `c`
       */
      const expected = {
        a: 'Here',
        b: 'Default B',
        c: 'Default C',
        d: 'Also here'
      }

      const result = defaultProps(theDefaults, input)
      expect(result).to.eql(expected)
    })
  })

  context('defaultTo', () => {
    const defaultTo = require('crocks/helpers/defaultTo')
    it('guards against null, undefined and NaN', () => {
      const result1 = defaultTo('x', null)
      const result2 = defaultTo('x', undefined)
      const result3 = defaultTo('x', NaN)

      expect(result1).to.equal('x')
      expect(result2).to.equal('x')
      expect(result3).to.equal('x')
    })
  })

  context('dissoc', () => {
    const dissoc = require('crocks/helpers/dissoc')
    it('Creates a new object without the specified property', () => {
      const input = {a: 'a', b: 'b', c: 'c'}
      const expected = {a: 'a', c: 'c'}
      const result = dissoc('b', input)
      expect(result).to.eql(expected)
    })
  })

  context('fanout', () => {
    const fanout = require('crocks/helpers/fanout')
    it('takes functions and created a Pair', () => {
      const splitValue = fanout(dbl, inc)
      const result = splitValue(5)
      expect(result.inspect()).to.equal('Pair( 10, 6 )')
    })

    it.skip('Works with Arrows', () => {
      // TODO: Figure out Arrows and write this test
    })
  })

  context('fromPairs', () => {
    const fromPairs = require('crocks/helpers/fromPairs')
    const Pair = require('crocks/Pair')
    const List = require('crocks/List')

    it('Creates an object from an array with a single Pair', () => {
      const input = [new Pair('a', 'A')]
      const expected = {a: 'A'}
      const result = fromPairs(input)
      expect(result).to.eql(expected)
    })

    it('Creates an object from an array of Pairs', () => {
      const input = [new Pair('a', 'A'), new Pair('b', 'B'), new Pair('c', 'C')]
      const expected = {a: 'A', b: 'B', c: 'C'}
      const result = fromPairs(input)
      expect(result).to.eql(expected)
    })

    it('Creates an object from a List of Pairs', () => {
      const input = List.fromArray(
        [new Pair('a', 'A'), new Pair('b', 'B'), new Pair('c', 'C')]
      )
      const expected = {a: 'A', b: 'B', c: 'C'}
      const result = fromPairs(input)
      expect(result).to.eql(expected)
    })
  })

  context('liftA2/liftA3', () => {
    const liftA2 = require('crocks/helpers/liftA2')
    const liftA3 = require('crocks/helpers/liftA3')
    const curry = require('crocks/helpers/curry')
    const identity = require('crocks/combinators/identity')
    const Identity = require('crocks/Identity')
    const add = curry((a, b) => a + b)

    it('Identity with Applicitive Functors', () => {
      const v = Identity.of('x')
      expect(Identity.of(identity).ap(v).valueOf()).to.eq(v.valueOf())
    })

    it('liftA2 applies a function to the values of 2 functors', () => {
      /**
       * All 3 approaches accomplish the same thing:
       * A curried function contained in a functor is applied
       * to the values contained in two more functors
       * With `lift`, there is no mention of the functor's type
       * So this Identity could be replaced with an Either, or an Async
       * (for example) without having to change any of the code
       * This essentially:
       * - replaces 2 `ap`s or an `ap` and a `map`
       * - Removes the need to identify the specific functor being used
       */

      /**
       * This is what liftA2 implementation looks like
       * from the mostly-adequate-guide
       * https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch10.html#bro-do-you-even-lift
       */
      // const liftA2 = curry(function (f, functor1, functor2) {
      //   return functor1.map(f).ap(functor2)
      // })
      const result1 = Identity.of(add)
        .ap(Identity.of(1))
        .ap(Identity.of(2))

      const result2 = Identity.of(1)
        .map(add)
        .ap(Identity.of(2))

      const result3 = liftA2(add, Identity(1), Identity(2))

      expect(result1.inspect()).to.equal('Identity 3')
      expect(result1.valueOf()).to.equal(3)

      expect(result2.inspect()).to.equal('Identity 3')
      expect(result2.valueOf()).to.equal(3)

      expect(result3.inspect()).to.equal('Identity 3')
      expect(result3.valueOf()).to.equal(3)
    })

    it('liftA3 applies a function to the values of 3 functors', () => {
      const add3 = curry((a, b, c) => a + b + c)
      const result = liftA3(add3, Identity.of(1), Identity.of(2), Identity.of(3))
      expect(result.valueOf()).to.equal(6)
    })

    /**
     * Just to illustrate that the use of `lift` allows you
     * to use one function with multiple types, as long as those
     * types are Applicatives
     */
    it('Can lift multiple types', () => {
      const Either = require('crocks/Either')
      const Maybe = require('crocks/Maybe')

      const oneE = Either.Right(1)
      const twoE = Either.Right(2)
      /**
       * I want to describe this as "lifting" add into an Applicative context
       * but I don't know if that's the right way to look at this or the right
       * way to describe it.
       */
      const lifter = liftA2(add)
      const eitherResult = lifter(oneE, twoE)

      const oneM = Maybe.Just(1)
      const twoM = Maybe.Just(2)
      const maybeResult = lifter(oneM, twoM)

      const eitherValue = eitherResult.either(() => {}, identity)
      const maybeValue = maybeResult.option(() => {}, identity)

      expect(eitherValue).to.equal(3)
      expect(maybeValue).to.equal(3)
    })
  })

  context.skip('mapReduce', () => {
    // TODO: Figure this out and add tests
    // const mapReduce = require('crocks/helpers/mapReduce')
  })

  context('objOf', () => {
    const objOf = require('crocks/helpers/objOf')
    it('Creates an object from a string and a value', () => {
      const expected = {a: 'A'}
      const createObject = objOf('a')
      const result = createObject('A')
      expect(result).to.eql(expected)
    })
  })

  context.skip('omit', () => {

  })

  context('once', () => {
    const once = require('crocks/helpers/once')
    it('Only runs the function once even when called mutiple times', () => {
      const fn = sinon.stub().returns(1)
      const onceFn = once(fn)
      onceFn()
      onceFn()
      onceFn()
      sinon.assert.calledOnce(fn)
    })
  })

  context('prop', () => {
    const prop = require('crocks/Maybe/prop')
    it('Returns a Just for an existing property', () => {
      const input = { a: 'A', b: 'B' }
      const result = prop('a', input)
      expect(result.inspect()).to.equal('Just "A"')
    })

    it('Returns a Nothing for a non-existent key', () => {
      const input = { a: 'A', b: 'B' }
      const result = prop('c', input)
      expect(result.inspect()).to.equal('Nothing')
    })
  })

  context('propPath', () => {
    const propPath = require('crocks/Maybe/propPath')
    it('Returns a Just for an existing property at a path', () => {
      const input = { a: { b: { c: 'C' } } }
      const result = propPath(['a', 'b', 'c'], input)
      expect(result.inspect()).to.equal('Just "C"')
    })

    it('Returns a Nothing for a non-existent key at a path', () => {
      const input = { a: { b: { c: 'C' } } }
      const result = propPath(['a', 'b', 'd'], input)
      expect(result.inspect()).to.equal('Nothing')
    })

    it('works with indexes too', () => {
      const input = { a: [ { b: ['C'] } ] }
      const result = propPath(['a', 0, 'b', 0], input)
      expect(result.inspect()).to.equal('Just "C"')
    })
  })

  context('safeLift', () => {
    const safeLift = require('crocks/Maybe/safeLift')
    const isNumber = require('crocks/predicates/isNumber')
    it('Lifts and operation into a Maybe context', () => {
      /**
       * Take an unsafe function and make it safe by lifting it into
       * a Maybe context. If the value satisfies your predicate, the value
       * will be passed to the function and you'll get the result back in
       * a Just. If the predicate evaluates to false, you will get back a
       * Nothing. This let's you avoid error conditions by accounting for
       * unexpected inputs like `null` or `undefined`
       */
      const safeInc = safeLift(isNumber, inc)
      const result = safeInc(1)
      const result2 = safeInc(null)
      const result3 = safeInc(undefined)
      const result4 = safeInc('x')
      /**
       * Compare with undefined & string passed to original function:
       * `undefined` will result in NaN
       * Passing a string will coerce the 1 to string and concat the values
       */
      const result5 = inc(undefined) // NaN
      const result6 = inc('x') // "x1"

      expect(result.option(3)).to.equal(2)
      expect(result2.option(3)).to.equal(3) // default val for Nothing
      expect(result3.option(3)).to.equal(3) // default val for Nothing
      expect(result4.option(3)).to.equal(3)
      expect(result5).to.be.NaN
      expect(result6).to.equal('x1')
    })

    /**
     * This works but I'm wondering if there is a simpler
     * way with the available functions.
     */
    it('Can be created for binary functions with liftA2', () => {
      const liftA2 = require('crocks/helpers/liftA2')
      const safe = require('crocks/Maybe/safe')
      const curry = require('crocks/helpers/curry')
      const safeLift2 = (pred, fn) => (a, b) => {
        const val1 = safe(pred, a)
        const val2 = safe(pred, b)
        const fnC = curry(fn)
        return liftA2(fnC, val1, val2)
      }
      const add = (a, b) => a + b
      const safeAdd = safeLift2(isNumber, add)
      const result = safeAdd(1, 2)
      const result2 = safeAdd(null, 2)
      const result3 = safeAdd(4, undefined)

      expect(result.inspect()).to.equal('Just 3')
      expect(result2.inspect()).to.equal('Nothing')
      expect(result3.inspect()).to.equal('Nothing')
    })
  })
})
