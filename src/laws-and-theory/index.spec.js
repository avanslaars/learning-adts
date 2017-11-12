const expect = require('chai').expect

describe('Understanding some of the laws', () => {
  const identity = require('crocks/combinators/identity')
  const Identity = require('crocks/Identity')

  it('Identity with Functors', () => {
    const v = Identity.of('x')
    expect(v.map(identity).valueOf()).to.eq(v.valueOf())
  })

  it('Identity with Applicitive Functors', () => {
    const v = Identity.of('x')
    expect(Identity.of(identity).ap(v).valueOf()).to.eq(v.valueOf())
  })
})
