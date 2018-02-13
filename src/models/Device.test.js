import Device, { CLAMP_BOUNCE } from './Device'

describe('A mesh device', () => {
  test('can be created at a position with clamping', () => {
    const device = new Device(10, 11, CLAMP_BOUNCE)
    expect(device.x).toBe(10)
    expect(device.y).toBe(11)
    expect(device.dx).toBe(0)
    expect(device.dy).toBe(0)
    expect(device.clamp).toBe(CLAMP_BOUNCE)
  })
  test('can be moved by hand', () => {
    const device = new Device(5, 6, CLAMP_BOUNCE)
    expect(device.x).toBe(5)
    expect(device.y).toBe(6)
    device.x = 10
    expect(device.x).toBe(10)
    device.y = 11
    expect(device.y).toBe(11)
  })
  test('can be primed for movement without being moved', () => {
    const device = new Device(100, 100, CLAMP_BOUNCE)
    expect(device.x).toBe(100)
    expect(device.y).toBe(100)
    device.dx = 20
    device.dy = 21
    expect(device.x).toBe(100)
    expect(device.y).toBe(100)
  })
})
