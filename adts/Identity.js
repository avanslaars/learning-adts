const crocks = require('crocks')
// ap, concat, equals, sequence, traverse, value

const { Identity } = crocks
const dbl = n => n * 2

// of is a "constructor" method for most of the ADTs in crocks
const id = Identity.of(3)
// inspect is a method that gives us nice output of a type instance
console.log('Result of Identity.of(3)', id.inspect()) // Identity 3

/**
 * Identity is basically just a container for a single value...
 * Let's see what it offers over just using a value
 */

const doubled = id.map(dbl)
console.log(doubled.inspect()) // Identity 6

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
