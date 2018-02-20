export const DEVICES = "devices"
export const STATS = "stats"

class History {
  constructor () {
    this._entryInProgress = false
    this._entries = []
  }

  /**
   * Add a new entry to the history.
   */
  startEntry () {
    this._entryInProgress = true
    this.currentEntry = new Map()
    this.currentEntryStats = new Map()

    return this
  }

  /**
   * Commit an entry to the history.
   */
  endEntry () {
    this._entryInProgress = false
    this._entries.push(this.currentEntry)

    return this
  }

  /**
   * Add devices to a history entry.
   * @requires An entry must be in progress.
   * @param {Device Array} devices
   */
  addDevices (devices) {
    if (!this._entryInProgress) {
      return null
    }

    this.currentEntry.set(DEVICES, devices)

    return this
  }

  get entryInProgress () {
    return this._entryInProgress
  }

  get entries () {
    return this._entries
  }
}

export default History
