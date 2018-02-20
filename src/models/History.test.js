import History, { DEVICES } from './History'
import Device, { CLAMP_BOUNCE } from './Device';

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

  test('commits an entry when ending', () => {
    let hist = new History()
    expect(hist.entries.length).toBe(0)
    hist.startEntry().endEntry()
    expect(hist.entries.length).toBe(1)
  })

  test('can contain an entry with a bunch of devices', () => {
    let devices = []
    for (let i = 0; i < 10; i++) {
      devices.push(new Device(100, 100, CLAMP_BOUNCE))
    }
    let hist = new History()
    hist.startEntry()
      .addDevices(devices)
      .endEntry()

    expect(hist.entries[0].get(DEVICES)).toBe(devices)
  })

  test('can contain multiple distinct entries', () => {
    let devices = []
    let devicesMore = []
    for (let i = 0; i < 5; i++) {
      devices.push(new Device(i, 10+i, CLAMP_BOUNCE))
      devicesMore.push(new Device(20+i, 20+i, CLAMP_BOUNCE))
    }

    let hist = new History()
    hist.startEntry()
      .addDevices(devices)
      .endEntry()
    hist.startEntry()
      .addDevices(devicesMore)
      .endEntry()

    expect(hist.entries[0].get(DEVICES)).toBe(devices)
    expect(hist.entries[1].get(DEVICES)).toBe(devicesMore)
  })
})