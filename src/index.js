import React from 'react'
import ReactDOM from 'react-dom'

import WorldMap from './components/WorldMap'

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<WorldMap width="1000" height="1000"/>, document.getElementById('app'))
})


