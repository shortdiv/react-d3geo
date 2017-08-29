import React, { Component } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chicagoNeighborhoods: [],
      usStates: [],
      width: props.width,
      height: props.height
    }
  }
  projection () {
    return geoMercator()
      .center([-87.623177, 41.881832])
      .scale(5000)
      .translate([this.state.width/2, this.state.height/2])
  }
  path () {
    return geoPath()
      .projection(null)
  }
  get transform () {
    const zoomTransform = this.props.zoomTransform

    let transform = ""
    if(zoomTransform) {
      transform = `translate(${zoomTransform.x}, ${zoomTransform.y}) scale(${zoomTransform.k})`
    }
    return transform
  }
  get scale () {
    const zoomTransform = this.props.zoomTransform

    let scale = ""
    if(zoomTransform) { scale = zoomTransform.k }
    return scale
  }
  componentDidMount () {
    var neighborhoods = fetch('./chicago_neighborhoods.json')
      .then(response => {
        if(response.status !== 200) {console.log(`error at ${response.status}`); return}
          return response.json()
      })

    var states = fetch('./us_states2.json')
      .then(response => {
        return response.json()
      })

    Promise.all([neighborhoods, states])
      .then(values => {
        const neighborhoods = values[0];
        const states = values[1]
        const tau = 2* Math.PI

        this.projection()
          .scale(1/tau)
          .translate([0, 0]);

        var state = feature(states, states.objects.us_states).features.filter((state) => {
          return state.properties.name.toLowerCase() === 'illinois'
        })[0]

        var b = this.path().bounds(state),
        s = .95 / Math.max((b[1][0] - b[0][0]) / this.state.width, (b[1][1] - b[0][1]) / this.state.height),
        t = [(this.state.width - s * (b[1][0] + b[0][0])) / 2, (this.state.height - s * (b[1][1] + b[0][1])) / 2];

        this.setState({
          chicagoNeighborhoods: feature(neighborhoods, neighborhoods.objects.chicago_neighborhoods).features,
          usStates: feature(states, states.objects.us_states).features,
          width: Math.max(this.state.width, window.innerWidth),
          height: Math.max(this.state.height, window.innerHeight),
        })

        this.projection()
          .scale(s)
          .translate(t);
      })
  }
  render () {
    const y = 0
    const styles = {
      transform: `translateY(${y}px)`
    }
    const view = `0 0 ${this.state.width} ${this.state.height}`
    return (
        <g className="states" transform={this.transform}>
          { this.state.usStates.map((d,i) => (
            <path
              key={`path-${i}`}
              d={geoPath().projection(this.projection())(d)}
              className={d.properties.name.toLowerCase()}
              fill={ `#ccc` }
              stroke="#FFFFFF"
              strokeWidth={ 0.5 /this.scale + "px" }
            />
          ))
          }
        </g>
    )
  }
}

export default Map
