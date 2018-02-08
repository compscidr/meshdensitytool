import React from 'react';

import YAML from 'yamljs'
import $ from 'jquery'

import Simulator from './Simulator'

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
      <div className="SimulationParameter param-grid-container">
        <label>{this.props.label}</label>
        <input id={this.props.id} type="text" value={this.state.value} onChange={this.handleChange} />
      </div>
    )
  }
}

class AppUI extends React.Component {
  constructor (props) {
    super(props)
    let canvas = document.getElementById('canvas')
    this.sim = new Simulator(canvas.getContext('2d'), canvas.width, canvas.height)
  }

  handleGenerateClick() {
    this.sim.generate(500, 500, $('#density').val(), $('#ap').val(), $('#coverage').val(), $('#dap').val(), $('#percent-internet').val())
    this.sim.run(false)
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

  // ref: https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
  updateConf () {
    // Config file loading
    var confInput = document.getElementById('conf')
    var curFiles = confInput.files
    var conf = curFiles[0]
    var reader = new FileReader();
    reader.readAsText(conf, "UTF-8");
    reader.onload = function (evt) {
      document.getElementById("fileContents").innerHTML = evt.target.result
      let nativeObject = YAML.parse(evt.target.result)
      const meshconf = nativeObject.meshdensitytool
      $('#density').val(meshconf.devices.density)
      $('#ap').val(meshconf.devices.wifi.hotspotPercentage)
      $('#coverage').val(meshconf.devices.wifi.hotspotRange)
      $('#dap').val(meshconf.devices.wifiDirect.hotspotPercentage)
      $('#percent-internet').val(meshconf.devices.internet.sharerPercentage)
    }
    reader.onerror = function (evt) {
      document.getElementById("fileContents").innerHTML = "error reading file";
    }
  }

  render () {
    return (
      <div>
        <SimulationParameter label="Population density / square km:" id="density" default="100" />
        <SimulationParameter label="Wifi hotspot percentage:" id="ap" default="20" />
        <SimulationParameter label="Wifi hotspot range:" id="coverage" default="20" />
        <SimulationParameter label="Wifi-direct hotspot percentage:" id="dap" default="5" />
        <SimulationParameter label="Percentage of internet-sharers:" id="percent-internet" default="5" />
        <br />
        <SimulationParameter label="Number of runs" id="runs" default="10" />

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

export default AppUI;
