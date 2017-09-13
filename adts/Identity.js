const crocks = require('crocks')
// sequence, traverse

const { Identity } = crocks
const dbl = n => n * 2
const inc = n => n + 1

// of is a "constructor" method for most of the ADTs in crocks
// const id = Identity.of(3)

// Using `new Identity` also works
const id = new Identity(3)

// inspect is a method that gives us nice output of a type instance
console.log('Result of Identity.of(3)', id.inspect()) // Identity 3

/**
 * Identity is basically just a container for a single value...
 * Let's see what it offers over just using a value
 */

const doubled = id.map(dbl)
console.log(doubled.inspect()) // Identity 6

/**
 * Since most methods on these ADTs will return a new instance of the same type
 * They can be dot-chained together...
 */

const doubleInc = id.map(dbl).map(inc)
console.log(doubleInc.inspect()) // Identity 7

/**
 * So, what happens in the map if the Identity is a null or undefined?
 */

const nullId = Identity.of(null)
console.log(nullId.inspect()) // Identity null

const doubleNull = nullId.map(dbl)
console.log(doubleNull.inspect()) // Identity 0

const undefId = Identity.of(undefined)
console.log(undefId.inspect()) // Identity undefined

const doubleUndef = undefId.map(dbl)
console.log(doubleUndef.inspect()) // Identity NaN

/**
 * It doesn't look like Identity offers us any safety for mapping...
 */

// Function that takes a value and returns an Identity
const idFn = val => Identity.of(val * 2)
const doubledIdMap = id.map(idFn)
console.log(doubledIdMap.inspect()) // Identity Identity 6

/**
 * When we map, our value is "unboxed", the fn applied and the result is "boxed"
 * This means if our function returns an ADT, it'll be an Identity of the other ADT of the value
 * In this case, we now have an Identity 3 inside an Identity...
 * We can `chain` instead of map to avoid that second layer of container
 */

// Using chain instead of map - now our value isn't wrapped...
const doubledIdChain = id.chain(idFn)
console.log(doubledIdChain.inspect()) // Identity 6

/**
 * What if our function returned a different type?
 * Well, if you include Maybe from crocks and run the code below
 * it will result in an exception:
 * TypeError: Identity.chain: Function must return an Identity
 * So if we want to chain, we must return the same type
 */
// const justFn = val => Maybe.Just(val * 2)
// const doubledIdChainJust = id.chain(justFn)
// console.log(doubledIdChainJust.inspect())

// The `value` method just unwraps and returns the contained value
console.log('value of id:', id.value())

/**
 * Let's look at the `ap` method...
 * We'll start with a function and wrap that in an Identity
 */

const wrappedDouble = Identity.of(dbl)
console.log(wrappedDouble.inspect()) // Identity Function

/**
 * We can apply a function wrapped in an Identity to a
 * value that is also wrapped in an Identity
 * and we get an Identity back that contains the result
 */

const wrappedResult = wrappedDouble.ap(id)
console.log(wrappedResult.inspect()) // Identity 6

/**
 * The `concat` method requires that the Identities involved contain semigroups
 * and those semigroups need to be of the same type
 * If not using semigroups you get this error:
 * Identity.concat: Both containers must contain Semigroups of the same type
 * For now, we should be able to get away with arrays...
 *
 */
const arrId1 = Identity.of([1, 2, 3])
const arrId2 = Identity.of([4, 5, 6])
const arrId = arrId1.concat(arrId2)

// So, concat unwraps values, concatenates them and returns the result wrapped in Identity
console.log(arrId.inspect()) // Identity [ 1, 2, 3, 4, 5, 6 ]

/**
 * `equals` compares contained values between two Identity instances
 */

const id2 = Identity.of(3)
const areEqual = id.equals(id2)
console.log(areEqual) // true

const obj = { name: 'test' }
const objId = Identity.of(obj)
const objId2 = Identity.of(obj)
const refEql = objId.equals(objId2)
console.log('reference equality', refEql)
