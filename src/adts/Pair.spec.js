/* eslint no-unused-expressions:0 */

'use strict'

const expect = require('chai').expect

describe('Pair', () => {
  const Pair = require('crocks/Pair')
  const identity = require('crocks/combinators/identity')
  const fanout = require('crocks/helpers/fanout')
  const { inc, dbl } = require('../utils')

  context('Pair construction', () => {
    it('is constructed with the new keyword', () => {
      const result = new Pair('first', 'second')
      expect(result.inspect()).to.eql('Pair( "first", "second" )')
    })

    it('Can be created with the fanout function', () => {
      /**
       * The fanout function takes 2 functions:
       * a -> b and a -> c
       * and returns a function that accepts a single argument
       * that argument is passed through each function and the result
       * of each are returned as the first and second values of the Pair
       * So you get a Pair( b, c )...
       * Let's look at a simple example
       */
      const createNumberPair = fanout(n => n * 2, identity)
      const result = createNumberPair(2)
      expect(result.inspect()).to.eql('Pair( 4, 2 )')
    })

    context('branch', () => {
      const branch = require('crocks/Pair/branch')
      it('Can be created with the branch function', () => {
        const result = branch(1)
        expect(result.inspect()).to.equal('Pair( 1, 1 )')
      })
    })
  })

  context('Mapping and Chaining with a Pair', () => {
    it('Invokes the transformation function on the second value', () => {
      const pair = new Pair(1, 2)
      const result = pair.map(dbl)
      expect(result.inspect()).to.eql('Pair( 1, 4 )')
    })

    it('Will nest Pairs if a mapped function returns a Pair', () => {
      const pair = new Pair(1, 2)
      // const { fanout, identity } = crocks
      const createNumberPair = fanout(n => n * 2, identity)
      const result = pair.map(createNumberPair)
      expect(result.inspect()).to.eql('Pair( 1, Pair( 4, 2 ) )')
    })

    /**
     * Based on previous examples with Identity, Either and Maybe
     * you might expect Pair.chain to just handle the previous
     * example by "flattening" the values... well, that doesn't
     * really work since in this case, our Pair would need to
     * wrap 3 values, and that would make it a threesome, not a Pair
     */
    it(`Can't just flatten nested pairs using chain`, () => {
      const pair = new Pair(1, 2)
      // const { fanout, identity } = crocks
      const createNumberPair = fanout(n => n * 2, identity)
      expect(() => pair.chain(createNumberPair)).to.throw(
        'Pair.chain: Semigroups of the same type required for first values'
      )
    })

    /**
     * So, it says a Semigroup of the same type is required for first values...
     *
     * https://github.com/fantasyland/fantasy-land#semigroup
     *
     * An array is a semigroup, so let's make sure that our original pair has
     * an array as it's first value and then when we create our "nested" Pair
     * that its first value is also an array
     */
    it('Requires the first to be a Semigroup to use chain', () => {
      // Updated to hold an array in first
      const pair = new Pair([1, 2], 3)
      // returns a single element array as its first value
      const createNumberPair = fanout(n => [n * 2], identity)
      // Now chain doesn't throw an exception
      const result = pair.chain(createNumberPair)
      /**
       * And we end up with a single Pair, where the first value
       * appears to be the result of calling `concat` on the
       * first from each Pair. As the second, we just get back our
       * transformed value from passing the second through the
       * transformation function. We're using identity in this case,
       * so there is no change to the value.
       */
      expect(result.inspect()).to.eql('Pair( [ 1, 2, 6 ], 3 )')
    })
  })

  context('Swapping values in a Pair', () => {
    const identity = require('crocks/combinators/identity')
    /**
     * Since some operations favor the second value over the first
     * We may have times where swapping values inside a Pair will
     * help is achieve an outcome, so we have the handy `swap` method
     * available to handle just such an occasion
     */
    it('Swaps the first and second values', () => {
      const pair = new Pair(1, 2)
      // Using identity to just swap the values
      const result = pair.swap(identity, identity)
      expect(result.inspect()).to.eql('Pair( 2, 1 )')
    })

    it('Applies transformations during the swap', () => {
      const pair = new Pair(1, 2)
      /**
       * Value is transformed, *then* swapped, so we'll increment
       * 1, then it'll end up as the second value. Same will happen
       * with the existing second... it'll be multiplied by 3, then
       * it'll end up as the first value
       */
      const result = pair.swap(x => x + 1, x => x * 3)
      expect(result.inspect()).to.eql('Pair( 6, 2 )')
    })
  })

  context('Transforming both values in a Pair with bimap', () => {
    it('Takes two transformation functions', () => {
      const pair = new Pair(1, 2)
      const result = pair.bimap(x => x + 1, x => x * 3)
      expect(result.inspect()).to.eql('Pair( 2, 6 )')
    })
  })

  context('Transform individual values with first and second utils', () => {
    // const { first, second } = crocks
    const first = require('crocks/pointfree/first')
    const second = require('crocks/pointfree/second')
    /**
     * Using `first` and `second` with a Pair let's us change one value
     * or the other and continue passing the unchanged value through our
     * composition
     */
    it('Can transform just the first value', () => {
      const pair = new Pair(1, 2)
      /**
       * `first` is curried. You need to call it first with your transformation
       * function, then you get back a function that you can pass your Pair into
       * It is not auto-curried, so you need to break it apart like this, or
       * use something like `uncurryN` from Ramda
       */
      const incFirst = first(inc)
      const result = incFirst(pair)
      expect(result.inspect()).to.eql('Pair( 2, 2 )')
    })

    it('Can transform just the second value', () => {
      const pair = new Pair(1, 2)
      /**
       * Just like `first`, `second` is curried. You need to call it first with
       * your transformation function, then you get back a function that you
       * can pass your Pair into
       */
      const incSecond = second(inc)
      const result = incSecond(pair)
      expect(result.inspect()).to.eql('Pair( 1, 3 )')
    })
  })

  context(`Accessing a Pair's values`, () => {
    /**
     * The pair wraps two values. We access them based on their position
     * using methods that extract either the first or the second value
     */
    it('Extracts the first value with fst', () => {
      const pair = new Pair(1, 2)
      const result = pair.fst()
      expect(result).to.eql(1)
    })

    it('Extracts the second value with snd', () => {
      const pair = new Pair(1, 2)
      const result = pair.snd()
      expect(result).to.eql(2)
    })

    /**
     * We can also get both values out of the Pair as an array
     */
    it('Extracts an array of two values with toArray', () => {
      const pair = new Pair(1, 2)
      const result = pair.toArray()
      expect(result).to.eql([1, 2])
    })
  })

  context('Combining first and second with merge', () => {
    it('Passes first and second as arguments to a converging function', () => {
      const pair = new Pair(1, 2)
      const add = (a, b) => a + b
      const result = pair.merge(add)
      expect(result).to.eql(3)
    })
  })

  context('Transform values based on the entire Pair with extend', () => {
    it('Passes the entire Pair and puts the result in second position', () => {
      const pair = new Pair(1, 2)
      const add = (a, b) => a + b
      /**
       * The function passed to extend receives the entire Pair as its argument
       * Then we can perform an operation on the Pair with the result
       * of that operation being the second value in the resulting Pair
       * For example, if we want to add both numbers but retain the original
       * first value for future transformations, we can use the passed Pair's
       * `merge` method, calculate a value and that will be the second value in
       * our result.
       */
      const result = pair.extend(p => p.merge(add))
      expect(result.inspect()).to.eql('Pair( 1, 3 )')
    })
  })

  context('Pair.concat', () => {
    /**
     * `concat` requires both values in a Pair to be Semigroups, meaning
     * they will have a concat method that will allow them to be concatenated
     * with another Semigroup of the same type.
     */
    it('Requires both first and second to contain Semigroups of the same type', () => {
      const pair1 = new Pair(1, 2)
      const pair2 = new Pair(3, 4)
      expect(() => pair1.concat(pair2)).to.throw(
        'Pair.concat: Both Pairs must contain Semigroups of the same type'
      )
    })

    it('concatenates firsts from each and seconds from each', () => {
      const pair1 = new Pair([1, 2], [3, 4])
      const pair2 = new Pair([5, 6], [7, 8])
      const result = pair1.concat(pair2)
      expect(result.inspect()).to.eql('Pair( [ 1, 2, 5, 6 ], [ 3, 4, 7, 8 ] )')
    })

    it('Only requires type matches between positions', () => {
      const pairA = new Pair(['a', 'b'], [1, 2])
      const pairB = new Pair(['c', 'd'], [3, 4])
      /**
       * Pair has a concat method, so it can be used where a Semigroup is required
       * So we can create two pairs, where the first are concatable Pairs themselves
       * The seconds in these will just be Arrays.
       * Calling concat with these pairs results in a concat call for the Pairs in
       * the first value and then an array.concat for the seconds
       */
      const pair1 = new Pair(pairA, [1])
      const pair2 = new Pair(pairB, [2])
      const result = pair1.concat(pair2)
      expect(result.inspect()).to.eql(
        'Pair( Pair( [ "a", "b", "c", "d" ], [ 1, 2, 3, 4 ] ), [ 1, 2 ] )'
      )
    })
  })

  context('Compare value equality with Pair.equals', () => {
    it('compares values by position', () => {
      const pair1 = new Pair(1, 2)
      const pair2 = new Pair(1, 2)
      const pair3 = new Pair(3, 4)
      const pair4 = new Pair(4, 3)

      const result1 = pair1.equals(pair2) // equal values
      expect(result1).to.be.true

      const result2 = pair1.equals(pair3) // not equal
      expect(result2).not.to.be.true

      const result3 = pair3.equals(pair4) // not equal
      expect(result3).not.to.be.true
    })
  })

  context('Apply functions with ap', () => {
    it('applies a function in a Pair to a value in a Pair', () => {
      /**
       * For the Pair type, `ap` will take a Pair with a function in
       * its second value. It will apply that function to the second of
       * another Pair. In order to return a new Pair, the first
       * of each Pair must be a Semigroup of the same type so they
       * can be concatenated together to make up the first value for
       * the new Pair
       */
      const pairFn = new Pair([3], dbl)

      const pairVal = new Pair([1], 2)
      const result = pairFn.ap(pairVal)
      expect(result.inspect()).to.eql('Pair( [ 3, 1 ], 4 )')
    })
  })
})
