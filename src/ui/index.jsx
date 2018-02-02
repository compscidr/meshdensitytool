import React from 'react'
import {render} from 'react-dom'

class App extends React.Component {
  render () {
    return <p> Webpack is watching React! </p>
  }
}

render(<App />, document.getElementById('app-ui'))
