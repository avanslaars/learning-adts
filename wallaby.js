module.exports = wallaby => {
  return {
    files: ['**/*.js', { pattern: '**/*.spec.js', ignore: true }],
    tests: ['**/*.spec.js'],
    env: {
      type: 'node'
    }
  }
}
