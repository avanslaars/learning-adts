'use strict'

const expect = require('chai').expect

const crocks = require('crocks')
const { Identity } = crocks
const { dbl, inc } = require('../utils')

describe('Identity Construction', () => {
  // of is a "constructor" method for most of the ADTs in crocks
  it('constructs with the of method', () => {
    const result = Identity.of(3)
    expect(result.inspect()).to.eql('Identity 3')
  })

  // Using `new Identity` also works
  it('constructs with new Identity', () => {
    const result = new Identity(3)
    expect(result.inspect()).to.eql('Identity 3')
  })
})

/**
 * Identity is basically just a container for a single value...
 * Let's see what it offers over just using a value
 */
describe('Mapping Identity', () => {
  it('uses map to transform contained values', () => {
    const id = Identity.of(3)
    const doubled = id.map(dbl)
    expect(doubled.inspect()).to.eql('Identity 6')
  })
  /**
 * Since most methods on these ADTs will return a new instance of the same type
 * They can be dot-chained together...
 */
  it('allows dot-chaining methods', () => {
    const id = Identity.of(3)
    const doubleInc = id.map(dbl).map(inc)
    expect(doubleInc.inspect()).to.eql('Identity 7')
  })
  /**
 * So, what happens in the map if the Identity is a null or undefined?
 * Well, in the case of identity, it will apply the function to any
 * contained value, so it really doesn't offer any kind of safety
 */
  it('will map over any contained value', () => {
    const nullId = Identity.of(null)
    expect(nullId.inspect()).to.eql('Identity null')

    const doubleNull = nullId.map(dbl)
    expect(doubleNull.inspect()).to.eql('Identity 0')

    const undefId = Identity.of(undefined)
    expect(undefId.inspect()).to.eql('Identity undefined')

    const doubleUndef = undefId.map(dbl)
    expect(doubleUndef.inspect()).to.eql('Identity NaN')
  })
})

describe('Chaining Identity', () => {
  /**
   * Let's define a function that takes a value and returns some result
   * based on that value as an Identity...
   */
  const idFn = val => Identity.of(val * 2)

  /**
   * Now we'll use this function in a call to map on an Identity...
   * And the result we end up with is Identity Identity 6
   * When we map, our value is "unboxed", the fn applied and the result is "boxed"
   * In this case, the result is an Identity, but `map` doesn't really care
   * what the result is, it'll wrap whatever it is up in our Identity
   */
  it('Nests types with map', () => {
    const id = Identity.of(3)
    const doubledIdMap = id.map(idFn)
    expect(doubledIdMap.inspect()).to.eql('Identity Identity 6')
  })
  /**
   * We can avoid this behavior by replacing our call to `map`
   * with a call to `chain`. Chain is sometimes called `flatMap`
   * in other libraries. This will apply our function and if that
   * function returns a result of the same type (another Identity in this case)
   * it will return a single Identity rather than leaving them nested
   */
  it('Flattens nested types when using chain', () => {
    const id = Identity.of(3)
    const doubledIdMap = id.chain(idFn)
    expect(doubledIdMap.inspect()).to.eql('Identity 6')
  })
  /**
 * What if our function returned a different type?
 * Well, above, I said "if that function returns a result of the same type..."
 * let's include the Maybe type from crocks and see what happens
 * it will result in an exception:
 * TypeError: Identity.chain: Function must return an Identity
 * So if we want to chain, we must return the same type
 */
  it(`doesn't take kindly to mixing types`, () => {
    const { Maybe } = crocks
    const id = Identity.of(3)
    const maybeVal = val => Maybe.of(val)
    expect(() => id.chain(maybeVal)).to.throw(
      'Identity.chain: Function must return an Identity'
    )
  })
})

describe('Identity value method', () => {
  it('Unwraps the Identity and returns the contained value', () => {
    const id = Identity.of(3)
    expect(id.value()).to.eql(3)
  })
})

/**
 * Let's look at the `ap` method...
 * We'll be using functions as the value in our Identity
 */
describe('Identity ap method', () => {
  // First class functions in JS mean we can have an Identity Function
  it('Can wrap a function like any other value', () => {
    // We're just using the dbl fn we pulled in from utils
    const idFn = Identity.of(dbl)
    expect(idFn.inspect()).to.eql('Identity Function')
  })
  /**
   * So, once we wrap a function in an Identity, what do we do with it?
  * We can apply a function wrapped in an Identity to a
  * value that is also wrapped in an Identity
  * and we get an Identity back that contains the result
  */
  it('Uses ap to apply a wrapped function to a wrapped value', () => {
    const idFn = Identity.of(dbl)
    const id = Identity.of(3)
    const result = idFn.ap(id)
    expect(result.inspect()).to.eql('Identity 6')
  })

  it(`doesn't work in reverse order`, () => {
    const idFn = Identity.of(dbl)
    const id = Identity.of(3)
    // Calling ap on an Identity that doesn't wrap a function will throw
    expect(() => id.ap(idFn)).to.throw(
      'Identity.ap: Wrapped value must be a function'
    )
  })
})

/**
 * The `concat` method requires that the Identities involved contain semigroups
 * and those semigroups need to be of the same type
 * If not using semigroups you get this error:
 * Identity.concat: Both containers must contain Semigroups of the same type
 * For now, we should be able to get away with arrays...
 *
 */
describe('Identity concat method', () => {
  /**
   * The `concat` method requires that the Identities involved contain semigroups
   * and those semigroups need to be of the same type
   * Luckily, arrays are valid semigroups, so we can get away with
   * arrays for now
   *
   */
  it('should run concat on wrapped arrays and return a wrapped array', () => {
    const idArr1 = Identity.of([1, 2, 3])
    const idArr2 = Identity.of([4, 5, 6])
    const result = idArr1.concat(idArr2)
    expect(result.inspect()).to.eql('Identity [ 1, 2, 3, 4, 5, 6 ]')
    expect(result.value()).to.eql([1, 2, 3, 4, 5, 6])
  })

  it(`will throw if one of the containers is not a semigroup`, () => {
    const idArr1 = Identity.of([1, 2, 3])
    const id = Identity.of(3)
    expect(() => id.concat(idArr1)).to.throw(
      'Identity.concat: Both containers must contain Semigroups of the same type'
    )
  })
})

describe('Identity equals', () => {
  it('compares wrapped values', () => {
    const id1 = Identity.of(3)
    const id2 = Identity.of(3)
    expect(id1).not.to.equal(id2) // Different obj references are not equal
    // eslint-disable-next-line no-unused-expressions
    expect(id1.equals(id2)).to.be.true // We expect wrapped values to be equal
  })
})
