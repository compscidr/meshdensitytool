class History {
  constructor () {
    this._entryInProgress = false
  }

  /**
   * Add a new entry to the history.
   */
  startEntry () {
    this._entryInProgress = true
  }

  get entryInProgress () {
    return this._entryInProgress
  }
}

export default History
