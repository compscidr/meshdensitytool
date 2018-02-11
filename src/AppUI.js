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
      $('#percent-internet').val())
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
    this.setState({wifiDirectHotspotPercentage: $('#dap').val()})
  }

  // ref: https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
  updateConf () {
    // Config file loading
    var confInput = document.getElementById('conf')
    var curFiles = confInput.files
    var conf = curFiles[0]
    var reader = new FileReader()
    reader.readAsText(conf, 'UTF-8')
    reader.onload = function (evt) {
      document.getElementById('fileContents').innerHTML = evt.target.result
      let nativeObject = YAML.parse(evt.target.result)
      const meshconf = nativeObject.meshdensitytool
      $('#density').val(meshconf.devices.density)
      $('#ap').val(meshconf.devices.wifi.hotspotPercentage)
      $('#coverage').val(meshconf.devices.wifi.hotspotRange)
      $('#dap').val(meshconf.devices.wifiDirect.hotspotPercentage)
      $('#percent-internet').val(meshconf.devices.internet.sharerPercentage)
    }
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
          default="5"
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
      </div>
    )
  }
}

export default AppUI
