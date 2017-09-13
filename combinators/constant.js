const crocks = require('crocks')

const { constant } = crocks

/**
 * constant takes a value and returns a function that
 * ignores any passed arguments and always returns that
 * initial value. This is called `always` in Ramda
 */

const alwaysThree = constant(3)
console.log(alwaysThree) // [Function]

const result = alwaysThree('this argument will be ignored')
console.log(result) // 3
