import History from './History'

describe('A history object', () => {
  test('can be created', () => {
    let hist = new History()
  })

  test('can have a new entry added', () => {
    let hist = new History()
    hist.startEntry()

    expect(hist.entryInProgress).toBe(true)
  })
})