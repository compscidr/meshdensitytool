import $ from 'jquery'

// stats
let hasHotspot
let avgHotspots
let avgClients

const RED_CHAN = 0
const GREEN_CHAN = 1
const BLUE_CHAN = 2
const ALPHA_CHAN = 3

const WIFI_LINK = 0
const BT_LINK = 1
const WIFI_DIRECT_LINK = 2
const CELL_LINK = 3
const INTERNET_LINK = 100

const BT_RANGE = 10

const WIFI_ENERGY = 10
const BT_ENERGY = 1
const WIFI_DIRECT_ENERGY = 10
const CELL_ENERGY = 100

const WIFI_HOTSPOT = "WIFI_HOTSPOT"
const WIFI_CLIENT = "WIFI_CLIENT"

const WIFI_DIRECT_HOTSPOT = "WIFI_DIRECT_HOTSPOT"
const WIFI_DIRECT_CLIENT = "WIFI_DIRECT_CLIENT"

const INTERNET_CONNECTED = "CELL_INTERNET"
const NOT_INTERNET_CONNECTED = "CELL_NO_INTERNET"

const WIFI_RADIO = "WIFI_RADIO"
const BT_RADIO = "BT_RADIO"
const WIFI_DIRECT_RADIO = "WIFI_DIRECT_RADIO"
const CELL_RADIO = "INTERNET_RADIO"

const CLAMP_BOUNCE = "CLAMP_BOUNCE"

const INFINITE_RANGE = -1

/**
* Store connection info of a link between two devices.
* There is no distinction between the two devices.
*/
class Link {
  constructor (left, right, type, delay, energy, cost) {
    this.left = left
    this.right = right
    this.type = type
    this.delay = delay
    this.energy = energy
    this.cost = cost
  }
}

class EnergyLink extends Link {
  constructor (left, right, type, energy) {
    super(left, right, type, 0, energy, 0)
  }
}

class Radio {
  constructor (defaultState, range) {
    this._enabled = defaultState
    this._range = range
  }

  enable () {
    this._enabled = false
  }

  disable () {
    this._enabled = true
  }

  get enabled () {
    return this._enabled
  }

  get range () {
    return this._range
  }
}

class Device {
  constructor (x, y, clamp) {
    this.radios = {}
    this.modes = {}
    this.moveTo(x, y)
    this._dx = 0
    this._dy = 0
    this.clamp = clamp
  }

  moveTo (x, y) {
    this._x = x
    this._y = y
  }

  addRadio (name, range) {
    this.radios[name] = new Radio(true, range)
  }

  radioMode (name, mode) {
    this.modes[name] = mode
  }

  is (name, mode) {
    if (this.modes[name] === mode) {
      return true
    }
    return false
  }

  range (name) {
    return this.radios[name].range
  }

  enableRadio (name) {
    this.radios[name].enable()
  }
  disableRadio (name) {
    this.radios[name].disable()
  }
  enabled (name) {
    return this.radios[name].enabled
  }

  get x () {
    return this._x
  }
  set x (pos) {
    this._x = pos
    switch (this.clamp) {
      case CLAMP_BOUNCE:
        if (this._x < 0) {
          this._x = 0
          this._dx *= -1
        }
        if (this._x > 500) {
          this._x = 500
          this._dx *= -1
        }
        break
      default:
        break
    }
  }

  get y () {
    return this._y
  }
  set y (pos) {
    this._y = pos
    switch(this.clamp) {
      case CLAMP_BOUNCE:
        if (this._y < 0) {
          this._y = 0
          this._dy *= -1
        }
        if (this._y > 500) {
          this._y = 500
          this._dy *= -1
        }
        break
      default:
        break
    }
  }

  get dx () {
    return this._dx
  }
  set dx (val) {
    this._dx = val
  }

  get dy () {
    return this._dy
  }
  set dy (val) {
    this._dy = val
  }
}

/**
* The simulator engine.
*/
class Simulator {

  constructor (context) {
    this.ctx = context
    this.id = this.ctx.getImageData(0, 0, 1, 1)
    this.intervalid = -1
  }

  generate (width, height, count, hotspotFraction, hotspotRange, dHotspotFraction, internetFraction) {

    if (this.intervalid !== -1) {
      clearInterval(this.intervalid)
    }

    this.width = width
    this.height = height
    this.count = count
    this.wifiHotspotFraction = hotspotFraction
    this.wifiHotspotRange = hotspotRange
    this.wifiDirectHotspotFraction = dHotspotFraction
    this.internetFraction = internetFraction

    this.links = []
    this.devices = []

    for (let counter = 0; counter < this.count; counter++) {
      let x = Math.floor(Math.random() * 500) // TODO: globals
      let y = Math.floor(Math.random() * 500)

      let device = new Device(x, y, CLAMP_BOUNCE)

      if (Math.floor(Math.random() * 100) < hotspotFraction) {
        let range = Math.floor(Math.random() * hotspotRange) + (2 / 3 * hotspotRange)
        device.addRadio(WIFI_RADIO, range)
        device.radioMode(WIFI_RADIO, WIFI_HOTSPOT)
      } else {
        device.addRadio(WIFI_RADIO, INFINITE_RANGE)
        device.radioMode(WIFI_RADIO, WIFI_CLIENT)
      }

      if (Math.floor(Math.random() * 100) < dHotspotFraction) {
        let range = Math.floor(Math.random() * hotspotRange) + (2/3 * hotspotRange)
        device.addRadio(WIFI_DIRECT_RADIO, range)
        device.radioMode(WIFI_DIRECT_RADIO, WIFI_DIRECT_HOTSPOT)
      } else {
        device.addRadio(WIFI_DIRECT_RADIO, INFINITE_RANGE)
        device.radioMode(WIFI_DIRECT_RADIO, WIFI_DIRECT_CLIENT)
      }

      if (Math.floor(Math.random() * 100) < internetFraction) {
        device.addRadio(CELL_RADIO, INFINITE_RANGE)
        device.radioMode(CELL_RADIO, INTERNET_CONNECTED)
      } else {
        device.addRadio(CELL_RADIO, INFINITE_RANGE)
        device.radioMode(CELL_RADIO, NOT_INTERNET_CONNECTED)
      }

      this.devices.push(device)
    }
  }

  run (continuous) {
    if (continuous === false) {
      this.frame()
    } else {
      this.intervalid = setInterval(this.frame.bind(this), 100)
    }
  }

  pause () {
    clearInterval(this.intervalid)
  }

  frame () {
    this.clear()
    this.update()
    this.draw()
  }

  clear () {
    this.ctx.clearRect(0, 0, 500, 500)
  }

  update () {
    let counter = 0
    while (counter < this.devices.length) {
      let device = this.devices[counter]

      this.moveDevice(device)

      counter++
    }
    this.links = []
    this.updateLinks()
    this.updateBTLinks()
    this.updateWDLinks()
  }

  moveDevice (device) {
    let xStep = (Math.random() * 0.2) - 0.1
    let yStep = (Math.random() * 0.2) - 0.1

    device.dx += xStep
    device.dy += yStep
    device.x += device.dx
    device.y += device.dy
  }

  getHotspots (device) {
    let index = 0
    let hotspots = []

    let counter = 0
    while (counter < this.devices.length) {
      if (this.devices[counter].is(WIFI_RADIO, WIFI_HOTSPOT) === true) {
        let distance = Math.sqrt(Math.pow(this.devices[counter].x - device.x, 2) + Math.pow(this.devices[counter].y - device.y, 2))
        if (distance < this.devices[counter].range(WIFI_RADIO)) {
          hotspots[index] = this.devices[counter]
          index++
        }
      }
      counter++
    }
    return hotspots
  }

  getClients (device) {
    if (!device.is(WIFI_RADIO, WIFI_HOTSPOT)) {
      return []
    }
    let index = 0
    let clients = []

    let counter = 0
    while (counter < this.devices.length) {
      let distance = Math.sqrt(Math.pow(this.devices[counter].x - device.x, 2) + Math.pow(this.devices[counter].y - device.y, 2))
      if (distance < device.range(WIFI_RADIO)) {
        clients[index] = this.devices[counter]
        index++
      }
      counter++
    }
    return clients
  }

  updateLinks () {
    // Wifi links
    for (let counterLeft in this.devices) {
      let deviceLeft = this.devices[counterLeft]
      let hotspots = this.getHotspots(deviceLeft)
      for (let counterRight in hotspots) {
        let deviceRight = hotspots[counterRight]

        // TODO: figure out where this bug comes from
        // Wifi is self-linking, which means that every device is
        // being reported as a hotspot of itself.
        // We remove self-links here, for now.

        if (deviceLeft !== deviceRight) {
          this.links.push(new EnergyLink(
            deviceLeft, deviceRight, WIFI_LINK, WIFI_ENERGY
          ))
        }
      }
    }

    // Internet links
    for (let counterLeft = 0; counterLeft < this.devices.length; counterLeft++) {
      let deviceLeft = this.devices[counterLeft]
      for (let counterRight = counterLeft + 1; counterRight < this.devices.length; counterRight++) {
        let deviceRight = this.devices[counterRight]
        if (deviceLeft.is(CELL_RADIO, INTERNET_CONNECTED)
            && deviceRight.is(CELL_RADIO, INTERNET_CONNECTED)) {
          this.links.push(new EnergyLink(
            deviceLeft, deviceRight, INTERNET_LINK, CELL_ENERGY
          ))
        }
      }
    }
  }

  updateWDLinks () {
    for (let counterLeft = 0; counterLeft < this.devices.length; counterLeft++) {
      let deviceLeft = this.devices[counterLeft]
      for (let counterRight = counterLeft + 1; counterRight < this.devices.length; counterRight++) {
        let deviceRight = this.devices[counterRight]
        let distance = Math.sqrt(Math.pow(deviceLeft.x - deviceRight.x, 2) + Math.pow(deviceLeft.y - deviceRight.y, 2))
        
        let rangeLimit = 0
        let canHazHotspot = false

        if (deviceLeft.is(WIFI_DIRECT_HOTSPOT)) {
          rangeLimit = deviceLeft.range(WIFI_DIRECT_RADIO)
          canHazHotspot = true
        } else if (deviceRight.is(WIFI_DIRECT_HOTSPOT)) {
          rangeLimit = deviceRight.range(WIFI_DIRECT_RADIO)
          canHazHotspot = true
        }

        if (canHazHotspot) {
          if (distance < rangeLimit) {
            this.links.push(new EnergyLink(
              deviceLeft, deviceRight, WIFI_DIRECT_LINK, WIFI_DIRECT_ENERGY
            ))
          }
        }

      }
    }
  }

  updateBTLinks () {
    for (let counterLeft = 0; counterLeft < this.devices.length; counterLeft++) {
      let deviceLeft = this.devices[counterLeft]
      for (let counterRight = counterLeft + 1; counterRight < this.devices.length; counterRight++) {
        let deviceRight = this.devices[counterRight]
        let distance = Math.sqrt(Math.pow(deviceLeft.x - deviceRight.x, 2) + Math.pow(deviceLeft.y - deviceRight.y, 2))
        if (distance < BT_RANGE) {
          this.links.push(new EnergyLink(
            deviceLeft, deviceRight, BT_LINK, BT_ENERGY
          ))
        }
      }
    }
  }

  draw () {
    let counter = 0
    while (counter < this.devices.length) {
      this.drawDevice(this.devices[counter])
      counter++
    }
    this.drawLinks()
    this.computeStats()
  }

  drawDevice (device) {
    this.id.data[RED_CHAN] = 0
    this.id.data[GREEN_CHAN] = 0
    this.id.data[BLUE_CHAN] = 0
    this.id.data[ALPHA_CHAN] = 255

    this.ctx.putImageData(this.id, device.x, device.y)
    if (device.is(WIFI_RADIO, WIFI_HOTSPOT) === true) {
      this.ctx.fillStyle = 'rgba(255, 10, 10, .2)'
      this.ctx.beginPath()
      this.ctx.arc(device.x, device.y, device.range(WIFI_RADIO), 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fill()
    }
    if (device.is(WIFI_DIRECT_RADIO, WIFI_DIRECT_HOTSPOT)) {
      this.ctx.fillStyle = 'rgba(155, 155, 10, .2)'
      this.ctx.beginPath()
      this.ctx.arc(device.x, device.y, device.range(WIFI_DIRECT_RADIO), 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fill()
    }
    this.ctx.fillStyle = 'rgba(10, 10, 255, .2)'
    this.ctx.beginPath()
    this.ctx.arc(device.x, device.y, BT_RANGE, 0, Math.PI * 2, true)
    this.ctx.closePath()
    this.ctx.fill()

    if (device.is(CELL_RADIO, INTERNET_CONNECTED)) {
      this.ctx.beginPath()
      this.ctx.fillStyle = 'rgba(0,0,0,.2)'
      this.ctx.strokeStyle = 'rgba(0,0,0,1)'
      this.ctx.arc(device.x, device.y, 5, 0, 2 * Math.PI)
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.stroke()
    }
  }

  drawLinks () {
    for (let counter in this.links) {
      let link = this.links[counter]
      if (link.type === WIFI_LINK) {
        this.ctx.strokeStyle = 'rgba(100, 10, 10, 1)'
        this.ctx.beginPath()
        this.ctx.moveTo(link.left.x, link.left.y)
        this.ctx.lineTo(link.right.x, link.right.y)
        this.ctx.stroke()
      } else if (link.type === BT_LINK) {
        this.ctx.strokeStyle = 'rgba(10, 10, 100, 1)'
        this.ctx.beginPath()
        this.ctx.moveTo(link.left.x, link.left.y)
        this.ctx.lineTo(link.right.x, link.right.y)
        this.ctx.stroke()
      } else if (link.type === WIFI_DIRECT_LINK) {
        this.ctx.strokeStyle = 'rgba(80, 80, 10, 1)'
        this.ctx.beginPath()
        this.ctx.moveTo(link.left.x, link.left.y)
        this.ctx.lineTo(link.right.x, link.right.y)
        this.ctx.stroke()
      } else if (link.type === INTERNET_LINK) {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, .1)'
        this.ctx.beginPath()
        this.ctx.moveTo(link.left.x, link.left.y)
        this.ctx.lineTo(link.right.x, link.right.y)
        this.ctx.stroke()
      }
    }
  }

  /**
   * Return the set of all devices that are connected to this one
   * by a local mesh. A local mesh is composed of devices that are connected
   * to each other not via the internet.
   */
  getLocalMeshDevices (device) {
    let nodesVisited = []
    let nodesToVisit = []
    let nodesToConsider = []

    nodesToVisit.push(device)

    while (nodesToVisit.length !== 0) {
      let visit = nodesToVisit[0]

      for (let counter in this.links) {
        let link = this.links[counter]

        nodesToConsider = []
        if (link.type !== INTERNET_LINK) {
          if (link.left === visit) {
            nodesToConsider.push(link.right)
          } else if (link.right === visit) {
            nodesToConsider.push(link.left)
          }
        }

        for (let considerCounter in nodesToConsider) {
          let consider = nodesToConsider[considerCounter]
          if (nodesVisited.indexOf(consider) === -1
              && nodesToVisit.indexOf(consider) === -1) {
            nodesToVisit.push(consider)
          }
        }
      }

      nodesVisited.push(visit)
      nodesToVisit.splice(nodesToVisit.indexOf(visit), 1)
    }

    return nodesVisited
  }

  /**
   * Return the set of all unconnected devices.
   */
  getUnconnectedDevices () {
    let unconnectedDevices = []
    for (let counter in this.devices) {
      let device = this.devices[counter]
      unconnectedDevices.push(device)
    }

    for (let counter in this.links) {
      let link = this.links[counter]
      let index = -1;
      index = unconnectedDevices.indexOf(link.left)
      if (index !== -1) {
        unconnectedDevices.splice(index, 1)
      }
      index = unconnectedDevices.indexOf(link.right)
      if (index !== -1) {
        unconnectedDevices.splice(index, 1)
      }
    }

    return unconnectedDevices
  }

  computeStats () {
    let largestLocalMeshSize = 0

    hasHotspot = 0
    avgHotspots = 0
    avgClients = 0
    let counter = 0
    let totalHotspots = 0
    let device = this.devices[0]
    while (counter < this.devices.length) {
      device = this.devices[counter]
      let hotspots = this.getHotspots(device)
      if (hotspots.length !== 0) {
        hasHotspot++
      }
      avgHotspots += hotspots.length
      counter++

      if (device.is(WIFI_RADIO, WIFI_HOTSPOT)) {
        totalHotspots++
        let clients = this.getClients(device)
        avgClients += clients.length
      }

      // Find largest local mesh
      let currentLocalMeshSize = 0
      if ((currentLocalMeshSize = this.getLocalMeshDevices(device).length)
           > largestLocalMeshSize) {
        largestLocalMeshSize = currentLocalMeshSize
      }
    }

    let totalEnergy = 0

    for (let counter in this.links) {
      let link = this.links[counter]
      totalEnergy += link.energy
    }

    $('#stat-density').text(this.count)
    $('#stat-wifi-hotspot-percent').text(this.wifiHotspotFraction)
    $('#stat-wifi-hotspot-range').text(this.wifiHotspotRange)
    $('#stat-wifi-hotspot-coverage').text(((hasHotspot / this.count) * 100).toFixed(2))
    $('#stat-wifi-average-hotspots').text((avgHotspots / hasHotspot).toFixed(2))
    $('#stat-wifi-average-clients').text((avgClients / totalHotspots).toFixed(2))
    $('#stat-total-energy').text(totalEnergy)
    $('#stat-unconnected').text(this.getUnconnectedDevices().length)
    $('#stat-largest-local').text(largestLocalMeshSize)
  }
}

export default Simulator;
