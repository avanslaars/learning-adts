// @ts-check

describe('Understanding some of the laws', () => {
  const identity = require('crocks/combinators/identity')
  const Identity = require('crocks/Identity')

  it('Identity with Functors', () => {
    const v = Identity.of('x')
    expect(v.map(identity).valueOf()).toEqual(v.valueOf())
  })

  it('Identity with Applicitive Functors', () => {
    const v = Identity.of('x')
    expect(Identity.of(identity).ap(v).valueOf()).toEqual(v.valueOf())
  })
})
