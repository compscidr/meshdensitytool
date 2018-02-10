import React from 'react'
import ReactDOM from 'react-dom'
import AppStats from './AppStats'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<AppStats />, div)
  ReactDOM.unmountComponentAtNode(div)
})
