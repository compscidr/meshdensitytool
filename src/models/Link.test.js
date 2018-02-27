import Link from './Link'
import Device, { CLAMP_BOUNCE } from './Device'

describe('A link', () => {
  test('can be created with all props', () => {
    let left = new Device(100, 100, CLAMP_BOUNCE)
    let right = new Device(100, 100, CLAMP_BOUNCE)
    let link = new Link(left, right, "type", 10, 11, 12)

    expect(link.left).toBe(left)
    expect(link.right).toBe(right)
    expect(link.type).toBe("type")
    expect(link.delay).toBe(10)
    expect(link.energy).toBe(11)
    expect(link.cost).toBe(12)
  })
})
