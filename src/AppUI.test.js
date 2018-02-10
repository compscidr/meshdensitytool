import React from 'react'
import ReactDOM from 'react-dom'
import AppUI from './AppUI'

it('renders without crashing', () => {
  const wrapper = document.createElement('div')
  const div = (
    <div>
      <canvas id="canvas" width="500" height="500"></canvas>
      <div id="root"></div>
    </div>
  )
  ReactDOM.renderIntoDocument(wrapper)
  ReactDOM.render(div, wrapper)
  ReactDOM.render(<AppUI />, document.getElementById('root'))
  ReactDOM.unmountComponentAtNode(wrapper)
})
