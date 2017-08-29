import React from 'react'
import ReactDOM from 'react-dom'

import ZoomableMap from './components/ZoomableMap'

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<ZoomableMap width={1000} height={1000}/>, document.getElementById('app'))
})


