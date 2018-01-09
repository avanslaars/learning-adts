// @ts-check

describe('IO', () => {
  const IO = require('crocks/IO')
  describe('construction', () => {
    /**
     * The goal here is to wrap impure/unsafe code
     * So something like the safeDOM could be wrapped
     * in an IO?
     */
    it('Can be created with a function in new', () => {
      const io = new IO(function () {
        return 10
      })
      expect(io.inspect()).toBe('IO Function')

      const result = io.map(n => n * 2)
      expect(result.inspect()).toEqual('IO Function')
      const out = result.run()
      expect(out).toBe(20)
    })

    it('Can be created with a value in of', () => {
      const io = IO.of(10)
      expect(io.inspect()).toBe('IO Function')

      const result = io.map(n => n * 2)
      expect(result.inspect()).toEqual('IO Function')
      const out = result.run()
      expect(out).toBe(20)
    })
  })
})
