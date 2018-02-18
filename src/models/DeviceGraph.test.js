import DeviceGraph from './DeviceGraph'

describe('A device graph', () => {
  test('can be created', () => {
    const graph = new DeviceGraph()
    expect(graph instanceof DeviceGraph)
  })
})