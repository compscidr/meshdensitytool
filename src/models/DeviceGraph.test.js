import DeviceGraph from './DeviceGraph'
import Device, { CLAMP_BOUNCE } from './Device'
import EnergyLink from './EnergyLink'
import LinkHint from './LinkHint'

function generateDevices (count) {
  let devices = []
  for (let i = 0; i < count; i++) {
    devices.push(new Device(i, 100+i, CLAMP_BOUNCE))
  }

  return devices
}

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

  test('can have last device removed', () => {
    let devices = []
    let contained = new Map()
    for (let i = 0; i < 10; i++) {
      let device = new Device(i, i+10, CLAMP_BOUNCE)
      devices.push(device)
      contained.set(device, false)
    }

    let graph = new DeviceGraph(devices)
    let lastDevice = devices[devices.length - 1]
    graph.removeDevice(lastDevice)
    for (let device of graph.devices) {
      contained.set(device, true)
    }
    expect(contained.get(lastDevice)).toBe(false)
  })

  test('can have first device removed', () => {
    let devices = []
    let contained = new Map()
    for (let i = 0; i < 10; i++) {
      let device = new Device(i, i+10, CLAMP_BOUNCE)
      devices.push(device)
      contained.set(device, false)
    }

    let graph = new DeviceGraph(devices)
    let firstDevice = devices[0]
    graph.removeDevice(firstDevice)
    for (let device of graph.devices) {
      contained.set(device, true)
    }
    expect(contained.get(firstDevice)).toBe(false)
  })

  test('can have a device removed', () => {
    let devices = []
    let contained = new Map()
    for (let i = 0; i < 10; i++) {
      let device = new Device(i, i+10, CLAMP_BOUNCE)
      devices.push(device)
      contained.set(device, false)
    }

    let graph = new DeviceGraph(devices)
    let device = devices[devices.length / 2]
    graph.removeDevice(device)
    for (let device of graph.devices) {
      contained.set(device, true)
    }
    expect(contained.get(device)).toBe(false)
  })

  test('can have only device removed', () => {
    let devices = []
    let contained = new Map()
    let device = new Device(100, 100, CLAMP_BOUNCE)
    devices.push(device)
    contained.set(device, false)

    let graph = new DeviceGraph(devices)
    let onlyDevice = devices[0]
    graph.removeDevice(onlyDevice)
    for (let device of graph.devices) {
      contained.set(device, true)
    }
    expect(contained.get(onlyDevice)).toBe(false)
  })

  test('can add a link', () => {
    let devices = generateDevices(10)
    const graph = new DeviceGraph(devices)
    let link = new EnergyLink(devices[0], devices[1], "test_link", 13)
    graph.addLink(link)
    expect(graph.isLinked(devices[0], devices[1])).toBe(true)
    expect(graph.isLinked(devices[1], devices[0])).toBe(true)
  })

  test('does not link unlinked devices', () => {
    let devices = generateDevices(10)
    const graph = new DeviceGraph(devices)
    let link = new EnergyLink(devices[0], devices[1], "test_link", 13)
    graph.addLink(link)

    let anyLinked = false
    for (let x = 0; x < devices.length; x++) {
      for (let y = 2; y < devices.length; y++) {
        anyLinked = anyLinked || graph.isLinked(devices[x], devices[y])
      }
    }

    expect(anyLinked).toBe(false)
  })

  test('can have a link removed', () => {
    let devices = generateDevices(10)
    const graph = new DeviceGraph(devices)
    let link = new EnergyLink(devices[0], devices[1], "test_link", 13)
    graph.addLink(link)

    let removalHint = new LinkHint()
      .addDevice(devices[0])
      .addDevice(devices[1])
      .addType("test_link")
      .build()

    graph.unlink(removalHint)

    expect(graph.isLinked(devices[0], devices[1])).toBe(false)
    expect(graph.isLinked(devices[1], devices[0])).toBe(false)
  })

  test('can have a link removed after adding it in both directions', () => {
    let devices = generateDevices(10)
    const graph = new DeviceGraph(devices)
    let link = new EnergyLink(devices[0], devices[1], "test_link", 13)
    let linkBack = new EnergyLink(devices[1], devices[0], "test_link", 14)
    graph.addLink(link)
    graph.addLink(linkBack)

    let removalHint = new LinkHint()
      .addDevice(devices[0])
      .addDevice(devices[1])
      .addType("test_link")
      .build()

    graph.unlink(removalHint)

    expect(graph.isLinked(devices[0], devices[1])).toBe(false)
    expect(graph.isLinked(devices[1], devices[0])).toBe(false)
  })

  test('can have link removed without removing other links', () => {
    let devices = generateDevices(10)
    const graph = new DeviceGraph(devices)
    let link = new EnergyLink(devices[0], devices[1], "test_link", 13)
    let linkBack = new EnergyLink(devices[1], devices[0], "test_link", 14)
    let link2 = new EnergyLink(devices[1], devices[2], "test_link", 12)
    graph.addLink(link)
    graph.addLink(linkBack)
    graph.addLink(link2)

    let removalHint = new LinkHint()
      .addDevice(devices[0])
      .addDevice(devices[1])
      .addType("test_link")
      .build()

    graph.unlink(removalHint)

    expect(graph.isLinked(devices[0], devices[1])).toBe(false)
    expect(graph.isLinked(devices[1], devices[0])).toBe(false)
    expect(graph.isLinked(devices[1], devices[2])).toBe(true)
    expect(graph.isLinked(devices[2], devices[1])).toBe(true)
  })
})
