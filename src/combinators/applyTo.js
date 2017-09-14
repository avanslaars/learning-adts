const crocks = require('crocks')

const { applyTo } = crocks

const dbl = n => n * 2

/**
 * applyTo takes a function as its first argument and returns the result of
 * applying that function to the second argument
 */
const doubled = applyTo(dbl, 3)
console.log(doubled) // 6

/**
 * applyTo (like most functions in crocks) is automatically curried
 * so supplying just the first argument will return a new
 * function that is ready to accept the second argument
 */

const doubleNum = applyTo(dbl)
console.log(doubleNum) // [Function]

const result = doubleNum(7)
console.log(result) // 14
