module.exports = wallaby => {
  return {
    files: ['src/**/*.js', { pattern: 'src/**/*.spec.js', ignore: true }],
    tests: ['src/**/*.spec.js'],
    env: {
      type: 'node'
    },
    testFramework: 'jest'
  }
}
