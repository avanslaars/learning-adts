const crocks = require('crocks')

// TODO: Define examples for: ap, concat, equals, sequence, traverse

const { Maybe, safe, prop } = crocks

// Some simple utility functions for demo purposes
const inc = n => n + 1
const dbl = n => n * 2

/**
 * Now that we can make a maybe, let's see what we can do with them...
 * Let's pretend we got these maybes from some function that could potentially
 * return a Just or a Nothing... we won't know ahead of time which one, so we
 * need code that can handle either scenario, and this is where the power of the
 * Maybe comes in...
 */

const theJust = Maybe.Just(5)
const theNothing = Maybe.Nothing()

/**
 * We'll use `map` to access our data and transform it
 * `map` unwraps the value from the container, applies the supplied function
 * and returns the same type, containing the new value
 */

const incDblMapped = theJust.map(inc).map(dbl)
console.log(incDblMapped.inspect()) // Just 12

// Now let's run the same maps on the Maybe that we know is a Nothing...
const incDblMapped2 = theNothing.map(inc).map(dbl)
console.log(incDblMapped2.inspect()) // Nothing

/**
 * Look at that, we just get a Nothing back. No attempt was made to execute our functions...
 * when `map` is called on a Nothing, a Nothing is returned and the function is not executed
 */

/**
 * The `safetyFirst` function is a result of using Boolean as the predicate for
 * the `safe` function, so it takes a value and returns a Maybe
 * (Nothing for a falsy value or Just <value>)
 * Let's see what happens when we `map` over our Just with this function
 */

const safetyFirst = safe(Boolean)
const reallySafe = theJust.map(safetyFirst)
console.log(reallySafe.inspect()) // Just Just 5

/**
 * That isn't a typo - the return value here is `Just Just 5`. We have a Maybe wrapped in another Maybe
 * This means we have and extra layer between us and our value. If we wanted to execute another function
 * in a second `map` - we'd have to account for getting a Maybe as the argument for that function
 * and then if we still wanted to transform the nested value, we'd have to access it within the nested Maybe
 * using `map` or some other method that would unwrap the value...
 *
 * So, this is where we should reach for `chain` - sometimes referred to as `flatMap` in other libraries,
 * `chain` will "flatten" our nested Maybe structure, leaving us with our value in a single Just
 *
 * I'd like to note that this example was mostly about showing what happens when you `map` where you should `chain`
 * The code below on its own is pointless, but demonstrates the difference between `map` and `chain`
 */

const normalSafe = theJust.chain(safetyFirst)
console.log(normalSafe.inspect()) // Just 5

/**
 * Let's look at ways to extract our value from a Maybe...
 * We'll work with our 2 known Maybe values so results are
 * completely predictable
 */

const withValue = theJust.map(inc).map(dbl) // Just 12
const noValue = theNothing.map(inc).map(dbl) // Nothing

// option - returns the unwrapped value or the supplied default for a Nothing
const valueFromOption = withValue.option(-3)
console.log(valueFromOption) // 12

const nothingFromOption = noValue.option(-3)
console.log(nothingFromOption) // -3

// either - runs a "left" function for a Nothing or a "right" function for a Just
const valueFromEither = withValue.either(
  () => 'No Value to Transform',
  n => `__${n}__`
)
console.log(valueFromEither) // __12__

const nothingFromEither = noValue.either(
  () => 'No Value to Transform',
  n => `__${n}__`
)
console.log(nothingFromEither) // "No Value to Transform"

/**
 * The Maybe keeps our operations safe by skipping operations that might otherwise
 * throw an exception with a null or undefined value
 * That's great, but sometimes you may want to run some operations anyway, just
 * using a default value if you end up with a Nothing
 * alt allows you to define a default Maybe that is returned in the event of a Nothing
 *
 */

const altWithValue = withValue.alt(Maybe.Just(10))
console.log(altWithValue.inspect()) // Just 12

const altWithNothing = noValue.alt(Maybe.Just(10))
console.log(altWithNothing.inspect()) // Just 10 - returning the default Maybe

/**
 * Let's look at an example of using alt to carry on with a default value
 * Here we have an input value that is missing the name property and a default
 * which has name defined.
 * We'll use the `prop` function supplied by crocks. It'll get the value of a property
 * but it will do it in a safe manner by returning a Maybe. If the value can't be found,
 * we'll get back a Nothing
 */

const defaultName = 'default'
const inputUser1 = { age: 30 } // missing the name prop
const inputUser2 = { name: 'charlotte', age: 1 }

const theName1 = prop('name', inputUser1)
const theName2 = prop('name', inputUser2)
console.log(theName1.inspect()) // Nothing
console.log(theName2.inspect()) // Just "charlotte"

const cappedName1 = theName1
  .alt(Maybe.of(defaultName)) // theName1 is a Nothing, so we'll end up with Just "default" here
  .map(str => str.toUpperCase())

console.log(cappedName1.inspect()) // Just "DEFAULT"

const cappedName2 = theName2
  .alt(Maybe.of(defaultName)) // theName is a Nothing, so we'll end up with Just "default" here
  .map(str => str.toUpperCase())

console.log(cappedName2.inspect()) // Just "CHARLOTTE"

/**
 * coalesce is another method that will allow us to recover when we end up with a Nothing
 * This time, instead of just defining a default Maybe value for the Nothing case,
 * we define a different function for each case. The "left" function executes in the
 * case of a Nothing and the result is passed on as a Just.
 * The "right" function runs for the Just case. This can be used to transform the value
 * or, to pass it through untouched, just use the identity function (`x => x`).
 * This is a good place to replace a map if you may end up with a Nothing and want to
 * continue on. You can project a new value on your Just or return a default and
 * carry on dot-chaining values.
 */

const coalesced1 = theName1
  .coalesce(() => 'DEFAULT', value => value.toUpperCase())
  .map(x => `Mapped: ${x}`)

console.log(coalesced1.inspect()) // Just "Mapped: DEFAULT"

const coalesced2 = theName2
  .coalesce(() => 'DEFAULT', value => value.toUpperCase())
  .map(x => `Mapped: ${x}`)

console.log(coalesced2.inspect()) // Just "Mapped: CHARLOTTE"
