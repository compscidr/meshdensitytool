import React from 'react'
import ReactDOM from 'react-dom'

class SimulationParameter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: this.props.default }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }
  render() {
    return (
      <div className="SimulationParameter" class="param-grid-container">
        <label>{this.props.label}</label>
        <input id={this.props.id} type="text" value={this.state.value} onChange={this.handleChange} />
      </div>
    )
  }
}

class AppUI extends React.Component {
  render () {
    return (
      <div>
      <SimulationParameter label="Population density / square km:" id="density" default="500" />
      <SimulationParameter label="Wifi hotspot percentage:" id="ap" default="10" />
      <SimulationParameter label="Wifi hotspot range:" id="coverage" default="20" />
      <SimulationParameter label="Wifi-direct hotspot percentage:" id="dap" default="5" />
      <SimulationParameter label="Percentage of internet-sharers:" id="percent-internet" default="5" />
      <br />
      <SimulationParameter label="Number of runs" id="runs" default="10" />
      </div>
    )
  }
}

class StatOutput extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div className="StatOutput">
        <div>{this.props.id}</div>
        <div id={this.props.id}></div>
      </div>
    )
  }
}

class AppStats extends React.Component {
  render () {
    return (
      <div>
        <StatOutput id="stat-density" />
        <StatOutput id="stat-wifi-hotspot-percent" />
        <StatOutput id="stat-wifi-hotspot-range" />
        <StatOutput id="stat-wifi-hotspot-coverage" />
        <StatOutput id="stat-wifi-average-hotspots" />
        <StatOutput id="stat-wifi-average-clients" />
        <StatOutput id="stat-total-energy" />
      </div>
    )
  }
}

ReactDOM.render(<AppUI />, document.getElementById('app-ui'))
ReactDOM.render(<AppStats />, document.getElementById('app-stats'))
