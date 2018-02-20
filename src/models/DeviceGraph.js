/**
 * The DeviceGraph is a set of utility functions for manipulating a set of devices
 * and links between them.
 */

class DeviceGraph {
  /**
   * Generate a new graph, containing the given devices.
   * @param {array} devices Optional : A list of devices to add to the graph.
   */
  constructor (devices = []) {
    this._devices = devices
    this._links = []
  }

  /**
   * Add a device to the graph.
   * @param {Device} device
   */
  addDevice (device) {
    this._devices.push(device)
  }

  /**
   * Remove a device from the graph.
   * @param {Device} device
   */
  removeDevice (device) {
    this._devices.splice(this._devices.indexOf(device))
  }

  /**
   * Add a link between devices.
   * @param {Link} link
   */
  addLink (link) {
    this._links.push(link)
  }

  /**
   * Remove all links matching the given properties.
   * @param {Link} hint A collection of properties to search for.
   */
  unlink (hint) {
    let shouldMatch = new Map()
    if (hint.left !== null) {
      shouldMatch.set("left", true)
    }
    else {
      shouldMatch.set("left", false)
    }

    if (hint.right !== null) {
      shouldMatch.set("right", true)
    }
    else {
      shouldMatch.set("right", false)
    }

    if (hint.type !== null) {
      shouldMatch.set("type", true)
    }
    else {
      shouldMatch.set("type", false)
    }

    let linksToRemove = []

    for (let link of this._links) {
      let matches = new Map()
      matches.set("left", link.left === hint.left)
      matches.set("right", link.right === hint.right)
      matches.set("type", link.type === hint.type)

      let isMatch =
        (matches.get("left") || !shouldMatch.get("left")) &&
        (matches.get("right") || !shouldMatch.get("right")) &&
        (matches.get("type") || !shouldMatch.get("type"))

      if (isMatch) {
        linksToRemove.push(link)
      }
    }

    for (let remove of linksToRemove) {
      this._links.splice(this._links.indexOf(remove))
    }
  }

  /**
   * Check if two devices are connected.
   * There is no distinction between the first and second arguments.
   * @param {Device} left
   * @param {Device} right
   */
  isLinked (left, right) {
    for (let link of this._links) {
      if (link.left === left && link.right === right ||
          link.right === left && link.left === right) {
            return true
      }
    }

    return false
  }

  /**
   *
   */
  get devices () {
    return this._devices
  }
}

export default DeviceGraph