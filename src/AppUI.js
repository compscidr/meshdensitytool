import React from 'react'

import YAML from 'yamljs'
import $ from 'jquery'

import Simulator from './Simulator'

class SimulationParameter extends React.Component {
  render () {
    return (
      <div className="SimulationParameter param-grid-container">
        <label>{this.props.label}</label>
        <input id={this.props.id} type="text" value={this.props.value} onChange={() => this.props.onChange()} />
      </div>
    )
  }
}

class AppUI extends React.Component {
  constructor (props) {
    super(props)
    let canvas = document.getElementById('canvas')
    this.sim = new Simulator(canvas.getContext('2d'), canvas.width, canvas.height)

    this.state = {
      density: 50,
      wifiHotspotPercentage: 15,
      wifiHotspotRange: 35,
      wifiDirectHotspotPercentage: 8,
      internetSharerPercentage: 3
    }

    this.regenerate()
  }

  regenerate () {
    this.sim.generate(
      500,
      500,
      this.state.density,
      this.state.wifiHotspotPercentage,
      this.state.wifiHotspotRange,
      this.state.wifiDirectHotspotPercentage,
      this.state.internetSharerPercentage,
    )
    this.sim.run(false)
  }

  handleGenerateClick () {
    this.setState({density: $('#density').val()})
    this.regenerate()
  }

  handleStepClick () {
    this.sim.run(false)
  }

  handleRunClick () {
    this.sim.run(true)
  }

  handlePauseClick () {
    this.sim.pause()
  }

  handleDensityChange () {
    this.setState({density: $('#density').val()})
  }

  handleWifiHotspotPercentageChange () {
    this.setState({wifiHotspotPercentage: $('#ap').val()})
  }

  handleWifiHotspotRangeChange () {
    this.setState({wifiHotspotRange: $('#coverage').val()})
  }

  handleWifiDirectHotspotPercentageChange () {
    this.setState({
      wifiDirectHotspotPercentage: $('#dap').val()}
    )
  }

  handleInternetSharerPercentageChange () {
    this.setState({
      internetSharerPercentage: $('#percent-internet').val()}
    )
  }

  handleConfLoad (event) {
    let nativeObject = YAML.parse(event.target.result)
    const meshconf = nativeObject.meshdensitytool
    this.setState({
      density: meshconf.devices.density,
      wifiHotspotPercentage: meshconf.devices.wifi.hotspotPercentage,
      wifiHotspotRange: meshconf.devices.wifi.hotspotRange,
      wifiDirectHotspotPercentage: meshconf.devices.wifiDirect.hotspotPercentage,
      internetSharerPercentage: meshconf.devices.internet.sharerPercentage,
    })
  }

  handleRegionClick (region) {
    let density = 0
    switch (region) {
      case "canada":
        density = 4
        break
      case "guatcity":
        density = 1000
        break
      case "toronto":
        density = 2650
        break
      case "vancouver":
        density = 5249
        break
    }

    this.setState({
      density: density
    })
  }

  // ref: https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
  updateConf () {
    // Config file loading
    var confInput = document.getElementById('conf')
    var curFiles = confInput.files
    var conf = curFiles[0]
    var reader = new FileReader()
    reader.readAsText(conf, 'UTF-8')
    reader.onload = (event) => this.handleConfLoad(event)
    reader.onerror = function (evt) {
      document.getElementById('fileContents').innerHTML = 'error reading file'
    }
  }

  render () {
    return (
      <div>
        <SimulationParameter
          label="Population density / square km:"
          id="density"
          value={this.state.density}
          onChange={() => this.handleDensityChange()}
        />
        <SimulationParameter
          label="Wifi hotspot percentage:"
          id="ap"
          value={this.state.wifiHotspotPercentage}
          onChange={() => this.handleWifiHotspotPercentageChange()}
        />
        <SimulationParameter
          label="Wifi hotspot range:"
          id="coverage"
          value={this.state.wifiHotspotRange}
          onChange={() => this.handleWifiHotspotRangeChange()}
        />
        <SimulationParameter
          label="Wifi-direct hotspot percentage:"
          id="dap"
          value={this.state.wifiDirectHotspotPercentage}
          onChange={() => this.handleWifiDirectHotspotPercentageChange()}
        />
        <SimulationParameter
          label="Percentage of internet-sharers:"
          id="percent-internet"
          value={this.state.internetSharerPercentage}
          onChange={() => this.handleInternetSharerPercentageChange()}
        />
        <br />
        <SimulationParameter
          label="Number of runs"
          id="runs"
          default="10"
        />

        <label>Config </label>
        <br/>
        <input id="conf" type="file" onChange={() => this.updateConf()} />
        <br/>
        <div id="fileContents">Contents</div>

        <button onClick={() => this.handleGenerateClick()}
          id="generate_btn" className="control-btn">Generate</button>
        <button onClick={() => this.handleStepClick()} id="step" className="control-btn">Step</button>
        <button onClick={() => this.handleRunClick()} id="animate" className="control-btn">Animate!</button>
        <button onClick={() => this.handlePauseClick()} id="pause" className="control-btn">Pause</button>

        <div class="grid-regions">
          <button onClick={() => this.handleRegionClick("canada")}>Canada</button>
          <button onClick={() => this.handleRegionClick("guatcity")}>Guatamala City</button>
          <button onClick={() => this.handleRegionClick("toronto")}>Vancouver</button>
          <button onClick={() => this.handleRegionClick("vancouver")}>Toronto</button>
        </div>
      </div>
    )
  }
}

export default AppUI
