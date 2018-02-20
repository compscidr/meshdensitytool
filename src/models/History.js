class History {
  constructor () {
    this._entryInProgress = false
  }

  /**
   * Add a new entry to the history.
   */
  startEntry () {
    this._entryInProgress = true

    return this
  }

  /**
   * Commit an entry to the history.
   */
  endEntry () {
    this._entryInProgress = false

    return this
  }

  get entryInProgress () {
    return this._entryInProgress
  }
}

export default History
