import React, { Component } from 'react';
import './SlopeChart.css';
import './SlopeChart.js';
class SlopeChart extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    console.log(this.props.data,this.props.models)
  }
  render() {
    return (
      <div className="Parent">
      
      </div>
    );
  }
}
export default SlopeChart;
