// @ts-check
const expect = require('chai').expect

describe('IO', () => {
  const IO = require('crocks/IO')
  context('construction', () => {
    /**
     * The goal here is to wrap impure/unsafe code
     * So something like the safeDOM could be wrapped
     * in an IO?
     */
    it('Can be created with a function in new', () => {
      const io = new IO(function () {
        return 10
      })
      expect(io.inspect()).to.equal('IO Function')

      const result = io.map(n => n * 2)
      expect(result.inspect()).to.eql('IO Function')
      const out = result.run()
      expect(out).to.equal(20)
    })

    it('Can be created with a value in of', () => {
      const io = IO.of(10)
      expect(io.inspect()).to.equal('IO Function')

      const result = io.map(n => n * 2)
      expect(result.inspect()).to.eql('IO Function')
      const out = result.run()
      expect(out).to.equal(20)
    })
  })
})
