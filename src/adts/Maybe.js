const crocks = require('crocks')

const { Maybe, safe } = crocks
const { Just, Nothing } = Maybe

/**
 * The Maybe type is a great way to safely handle values that may be
 * null or undefined and is one of the most basic ADTs that has practical application
 * all on its own
 */

// const maybeThree = Maybe.of(3)
const maybeThree = new Maybe(3)
console.log(maybeThree.inspect()) // Just 3

const justThree = Just(3)
console.log(justThree.inspect()) // Just 3

// Nothing doesn't carry a value - passing this an arg will still yield only Nothing
const aNothing = Nothing()
console.log(aNothing.inspect()) // Nothing

/**
 * You might think null or undefined would automatically be converted to a Nothing
 * but this is not the case. The constructor doesn't come with any opinions. That's a good thing :)
 */
// const justNull = Maybe.of(null)
const justNull = new Maybe(null)
console.log(justNull.inspect()) // Just null

// We can get a nothing using the `zero` method
const zNothing = Maybe.zero()
console.log(zNothing.inspect()) // Nothing

/**
 * To get back a Just or Nothing we can create a function and make the decision
 * ourselves
 * None of these are being logged, but throw any of the resulting values in a console.log
 * to verify the output supplied in the comment
 */

// This will give is a Nothing for any falsy value
const getMaybe = value => (value ? Just(value) : Nothing())

// eslint-disable-next-line no-unused-vars
const maybeNull = getMaybe(null) // Nothing

// eslint-disable-next-line no-unused-vars
const maybeUndefined = getMaybe(null) // Nothing

// eslint-disable-next-line no-unused-vars
const maybeFour = getMaybe(4) // Just 4

// eslint-disable-next-line no-unused-vars
const maybeZero = getMaybe(0) // Nothing

// eslint-disable-next-line no-unused-vars
const maybeEmptyString = getMaybe('') // Nothing

// eslint-disable-next-line no-unused-vars
const maybeName = getMaybe('Bob') // Just "Bob"

/**
 * We can accomplish the same thing with the `safe` utility function provided by crocks.
 * `safe` takes a predicate function (a function that returns a bool) and a value
 * and returns a Just or Nothing based on evaluating that predicate against the value
 */

const maybeUndef = safe(Boolean, undefined)
console.log(maybeUndef) // Nothing

const maybeFive = safe(Boolean, 5)
console.log(maybeFive) // Just 5

/**
 * And of course, `safe` is curried, so we can create a new function by passing it just
 * our predicate and then using that resulting function on multiple values
 */

const betweenOneAndTen = n => n >= 1 && n <= 10
// betweenOneAndTen(5) // true
// betweenOneAndTen(11) // false

// Sure, the name is terrible, but names are hard and this demonstrates the point
const maybeBetweenOneAndTen = safe(betweenOneAndTen)

const shouldBeJust = maybeBetweenOneAndTen(4)
console.log(shouldBeJust.inspect()) // Just 4

const shouldBeNothing = maybeBetweenOneAndTen(12)
console.log(shouldBeNothing.inspect()) // Nothing

/**
 * Now that we can create a maybe, let's head over to the MaybeMethods.js file
 * and do some stuff so we can see what the point of all of this is.
 */
