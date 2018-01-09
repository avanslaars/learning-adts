// @ts-check
'use strict'

describe('State', () => {
  const State = require('crocks/State')
  const Pair = require('crocks/Pair')

  describe('Basics', () => {
    it('of puts the value in the resultant - runWith supplies the state', () => {
      const s = State.of(3)
      const result = s.runWith(10)
      expect(result.inspect()).toBe('Pair( 3, 10 )')
    })

    it('ctor takes fn s => Pair(v, s)', () => {
      /**
       * Take in the value from `runWith`
       * double it as the resultant and
       * store the original as state
       */
      const s = State(s => Pair(s * 2, s))
      const result = s.runWith(10)
      expect(result.inspect()).toBe('Pair( 20, 10 )')
    })

    it('get creates state that puts the initial state in fst & snd of Pair', () => {
      const s = State.get()
      const result = s.runWith(10)
      expect(result.inspect()).toBe('Pair( 10, 10 )')
    })

    it('map changes the resultant', () => {
      const s = State.of(3)
        .map(n => n * 2)

      const result = s.runWith(10)

      expect(result.inspect()).toBe('Pair( 6, 10 )')
    })
  })
})
