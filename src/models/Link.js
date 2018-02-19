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


export default Link
