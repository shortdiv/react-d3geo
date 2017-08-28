import React, { Component } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

class WorldMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chicagoNeighborhoods: [],
      width: 960,
      height: 500
    }
  }
  projection () {
    return geoMercator()
      .center([-87.623177, 41.881832])
      .scale(50000)
      .translate([this.state.width/2, this.state.height/2])
  }
  path () {
    return geoPath()
      .projection(this.projection())
  }
  componentDidMount () {
    fetch('./chicago_neighborhoods.json')
      .then(response => {
        if(response.status !== 200) {console.log(`error at ${response.status}`); return}
        response.json().then(neighborhoods => {
          this.projection()
            .scale(1)
            .translate([0, 0]);

          var b = this.path().bounds(neighborhoods),
          s = .95 / Math.max((b[1][0] - b[0][0]) / this.state.width, (b[1][1] - b[0][1]) / this.state.height),
          t = [(this.state.width - s * (b[1][0] + b[0][0])) / 2, (this.state.height - s * (b[1][1] + b[0][1])) / 2];

          this.setState({
            chicagoNeighborhoods: feature(neighborhoods, neighborhoods.objects.chicago_neighborhoods).features
          })

          this.projection()
            .scale(s)
            .translate(t);
        })
      })
  }
  render () {
    const y = -70
    const styles = {
      transform: `translateY(${y}px)`
    }
    return (
      <svg width={ 960 } height= { 500 } viewBox="0 0 960 500">
        <g className="chicagoNeighborhoods" style={styles}>
          { this.state.chicagoNeighborhoods.map((d,i) => (
             <path
               key={ `path-${ i }` }
               d={ geoPath().projection(this.projection())(d) }
               className="neighborhood"
               fill={ `#ccc` }
               stroke="#FFFFFF"
               strokeWidth={ 0.5 }
             />
          ))
          }
        </g>
      </svg>
    )
  }
}

export default WorldMap
