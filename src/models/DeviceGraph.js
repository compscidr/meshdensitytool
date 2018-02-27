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
  }

  /**
   * Check if two devices are connected.
   * There is no distinction between the first and second arguments.
   * @param {Device} left
   * @param {Device} right
   */
  isLinked (left, right) {
    for (let link of this._links) {
      if ((link.left === left && link.right === right) ||
          (link.right === left && link.left === right)) {
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
