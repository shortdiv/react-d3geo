import React, { Component } from 'react'
import { geoMercator, geoPath, geoTile } from 'd3-geo'
import { zoom, zoomTransform } from 'd3-zoom'
import { select } from 'd3-selection'
import { feature } from 'topojson-client'

import Map from './Map'

class ZoomableMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zoomTransform: null
    }
    this.zoom = zoom()
                  .scaleExtent([1, 8])
                  .on("zoom", this.zoomed.bind(this))
  }
  zoomed () {
    this.setState({
      zoomTransform: zoomTransform(this.refs.svg)
    })
  }
  componentDidMount () {
    select(this.refs.svg)
      .call(this.zoom)
  }
  componentDidUpdate() {
    select(this.refs.svg)
      .call(this.zoom)
  }
  render () {
    const { width, height } = this.props
    const { zoomTransform } = this.state
    return (
      <svg width={width} height={height} ref="svg">
        <Map
          width={width}
          height={height}
          zoomTransform={zoomTransform}
        />
        <rect
          width="100px"
          height="100px"
          x={width/2}
          y={height/2}
          fill="none"
        />
      </svg>
    )
  }
}

export default ZoomableMap
