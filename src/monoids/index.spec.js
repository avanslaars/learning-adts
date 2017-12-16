// @ts-check
const expect = require('chai').expect

describe('Monoids', () => {
  const inc = n => n + 1
  const dbl = n => n * 2

  context('Sum', () => {
    const Sum = require('crocks/Sum')
    it('Sum adds values through concat', () => {
      const s1 = Sum(1)
      const s2 = Sum(2)
      expect(s1.concat(s2).inspect()).to.equal('Sum 3')
    })
  })

  context('All', () => {
    const All = require('crocks/All')
    it('All contains booleans & concat is logical AND', () => {
      const a1 = All.empty() // All true
      const a2 = All(false) // All false
      expect(a1.concat(a2).inspect()).to.equal('All false')
    })

    it('All contains booleans & concat is logical AND', () => {
      const a1 = All.empty() // All true
      const a2 = All('test') // All true
      const a3 = All(3) // All true
      expect(a1.concat(a2).concat(a3).inspect()).to.equal('All true')
    })
  })

  context('First', () => {
    const First = require('crocks/First')
    const Maybe = require('crocks/Maybe')
    it('Keeps the First Just from the concat', () => {
      const f1 = First(Maybe.Just(1))
      const f2 = First(Maybe.Nothing())
      const f3 = First(Maybe.Just(3))

      f1.concat(f2).concat(f3) // First( Just 1 )
      f2.concat(f1).concat(f3) // First( Just 1 )
      f3.concat(f2).concat(f1) // First( Just 3 )
    })
  })

  context('Last', () => {
    const Last = require('crocks/Last')
    const Maybe = require('crocks/Maybe')
    it('Keeps the Last Just from the concat', () => {
      const l1 = Last(Maybe.Just(1))
      const l2 = Last(Maybe.Nothing())
      const l3 = Last(Maybe.Just(3))

      l1.concat(l2).concat(l3) // Last( Just 3 )
      l2.concat(l1).concat(l3) // Last( Just 3 )
      l3.concat(l1).concat(l2) // Last( Just 1 )
    })
  })

  context('Endo', () => {
    const Endo = require('crocks/Endo')
    it('composes functions', () => {
      const e1 = Endo(inc)
      const e2 = Endo(dbl)
      const fn = e1.concat(e2).valueOf()
      const result = fn(2)
      expect(result).to.equal(6)
    })
  })

  context('mconcat and mreduce', () => {
    const mconcat = require('crocks/helpers/mconcat')
    const mreduce = require('crocks/helpers/mreduce')
    context('with All', () => {
      const All = require('crocks/All')
      it('Concats a list to a All bool with All', () => {
        const result1 = mconcat(All, [true, 'test', 3])
        const result2 = mconcat(All, [true, '', 3])

        expect(result1.inspect()).to.equal('All true')
        expect(result2.inspect()).to.equal('All false')
      })

      it('Reduces a list to a boolean with All', () => {
        const result1 = mreduce(All, [true, 'test', 3]) // true
        const result2 = mreduce(All, [true, '', 3]) // false

        expect(result1).to.equal(true)
        expect(result2).to.equal(false)
      })
    })

    context('with Sum', () => {
      const Sum = require('crocks/Sum')
      it('adds up a list of numbers', () => {
        const result = mconcat(Sum, [1, 2, 3, 4, 5])
        expect(result.inspect()).to.equal('Sum 15')
      })

      it('adds up a list of numbers', () => {
        const result = mreduce(Sum, [1, 2, 3, 4, 5])
        expect(result).to.equal(15)
      })
    })

    context('with Endo', () => {
      const Endo = require('crocks/Endo')
      const inc = n => n + 1
      const dbl = n => n * 2

      it('composes functions from the list, left to right', () => {
        const fn = mreduce(Endo, [inc, dbl])
        const result = fn(3)
        expect(result).to.equal(8)
      })
    })
  })
})
