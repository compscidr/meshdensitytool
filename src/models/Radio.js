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

export default Radio