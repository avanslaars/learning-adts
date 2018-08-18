module.exports = {
  runner: 'jest-runner-standard',
  testMatch: ['<rootDir>/src/**/*.js'],
  displayName: 'lint',
  reporters: ['jest-silent-reporter']
}
