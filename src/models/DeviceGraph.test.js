import DeviceGraph from './DeviceGraph'
import Device, { CLAMP_BOUNCE } from './Device';

describe('A device graph', () => {
  test('can be created', () => {
    const graph = new DeviceGraph()
    expect(graph instanceof DeviceGraph)
  })
  test('does not contain any devices before one is added', () => {
    const graph = new DeviceGraph()

    let devices = graph.devices
    let counter = 0
    for (let device of devices) {
      counter++
    }
    expect(counter).toBe(0)
  })
  test('can add a device', () => {
    const graph = new DeviceGraph()

    let devices = graph.devices
    let counter = 0
    for (let device of devices) {
      counter++
    }
    expect(counter).toBe(0)

    const testDevice = new Device(100, 100, CLAMP_BOUNCE)
    graph.addDevice(testDevice)
    devices = graph.devices
    counter = 0
    let found = false
    for (let device of devices) {
      counter++
      if (device === testDevice) {
        found = true
      }
    }
    expect(found).toBe(true)
    expect(counter).toBe(1)
  })
  test('can be created from a list of devices', () => {
    let devices = []
    let contained = new Map()
    for (let i = 0; i < 10; i++) {
      let device = new Device(i, i+10, CLAMP_BOUNCE)
      devices.push(device)
      contained.set(device, false)
    }

    const graph = new DeviceGraph(devices)
    const graphDevices = graph.devices
    for (let graphDevice of graphDevices) {
      contained.set(graphDevice, true)
    }

    let containsAll = true
    for (let contains of contained.values()) {
      containsAll = containsAll && contains
    }
    expect(containsAll).toBe(true)
  })
})