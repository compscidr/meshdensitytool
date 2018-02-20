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

  test('can have an entry ended', () => {
    let hist = new History()
    hist.startEntry()
    hist.endEntry()
    expect(hist.entryInProgress).toBe(false)

    hist.startEntry().endEntry()
    expect(hist.entryInProgress).toBe(false)
  })
})