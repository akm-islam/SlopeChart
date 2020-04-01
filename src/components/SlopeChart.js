import React, { Component } from 'react';
import './SlopeChart.css';
import * as d3 from 'd3';
import * as $ from 'jquery';
class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount(){
    var parent_width=$('.slopechart').width();
    //console.log($('.slopechart').width())
    var mydata3={"A":[],"B":[]}
    var original_data=this.props.data[this.props.year]
    var model_name=this.props.model_name
    var start_range=0;
    var end_range=20;
    var all_models=this.props.models;
    var temp_array_for_max=[]
    for(var i=0;i<all_models.length;i++){
      var temp_model=all_models[i]
      for(var j=start_range;j<end_range;j++){
          temp_array_for_max.push(original_data[j][temp_model])
      }
    }
var mymax=Math.max.apply(Math, temp_array_for_max) // This is to calculate the max among all models to use that as the end value to set the height 
    for(var i=start_range;i<end_range;i++){
      var tempA={}
      var tempB={}
      tempA["Model"]=model_name
      tempA["name"]=original_data[i]["State"]
      tempA["rank"]=original_data[i]["two_realRank"]
      tempB["name"]=original_data[i]["State"]
      tempB["rank"]=original_data[i][model_name]
      mydata3["A"].push(tempA)
      mydata3["B"].push(tempB)
    }
    console.log(mydata3)
    //this.CreateSlopeChart(this.props.data2)
    this.CreateSlopeChart(mydata3,parent_width,mymax)
  }

//----------------------------------------------------------------------------------------------------------------------------------------------------CreateSlopeChart function
  CreateSlopeChart=(data,parent_width,mymax)=>{
    const node = this.node
var all_together = [];
data["A"].forEach(function(d) {all_together.push(d);});
data["B"].forEach(function(d) {all_together.push(d);});
var nestedByName = d3.nest().key(function(d) { return d.name }).entries(all_together);
console.log(nestedByName)
var y1Min = d3.min(nestedByName, function(d) {        
  return 10; // set ymin greater than the min to make it grow negatively
  return Math.min(d.values[0].rank, d.values[1].rank);
});      
var y1Max = d3.max(nestedByName, function(d) {        
  return mymax - 10; // set the max less than the max so it will overgrow
  //return Math.max(d.values[0].rank, d.values[1].rank);
});
//--------
    var margin = {top: 70, right: 70, bottom: 40, left: 150};
    var width = parent_width - margin.left - margin.right;
    var	height = 23*this.props.mymax - margin.top - margin.bottom;
    var svg = d3.select(node).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  
    var config = {yOffset: 30,width: width,height: height,labelGroupOffset: 0,labelKeyOffset: 50,radius: 3,}
//------- This wont need anymore    
      var yScale = d3.scaleLinear().range([0,height]).domain([y1Min, y1Max]);
//-------- Width and heigh

//------------------------------------------Ractangle that sets the boundary of lines  
      var borderLines = svg.append("g").attr("class", "border-lines")
      borderLines.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", config.height); // left line x1,x2,y1 0 and y2 is the height
      borderLines.append("line").attr("x1", width).attr("y1", 0).attr("x2", width).attr("y2", config.height); // right line starts at x1,x2 at width and goes until height
//------------------------------------------Group containing the text and slope
    var slopeGroups = svg.append("g").selectAll("g").data(nestedByName).enter().append("g").attr("class", "slope-group")
    var slopeLines = slopeGroups.append("line").attr("class", "slope-line").attr("x1", 0).attr("y1", function(d) {
	  return yScale(d.values[0].rank);
	  })
	  .attr("x2", config.width)
	  .attr("y2", function(d) {
    //return 100;
	  return yScale(d.values[1].rank);
	});

//------------------------------------------Left side
      var leftSlopeCircle = slopeGroups.append("circle").attr("r", config.radius).attr("cy", d => yScale(d.values[0].rank));
      var leftSlopeLabels = slopeGroups.append("g").attr("class", "slope-label-left")
      	.each(function(d) {
          d.xLeftPosition = -config.labelGroupOffset;
          d.yLeftPosition = yScale(d.values[0].rank);
        });
      leftSlopeLabels.append("text")
      	.attr("class", "label-figure")
      	.attr("x", d => d.xLeftPosition)
				.attr("y", d => d.yLeftPosition)
        .attr("dx", -10)
        .attr("dy", 3)
        .attr("text-anchor", "end")
        .text(d => (d.values[0].rank));
      
      leftSlopeLabels.append("text")
      	.attr("x", d => d.xLeftPosition)
				.attr("y", d => d.yLeftPosition)
        .attr("dx", -config.labelKeyOffset)
        .attr("dy", 3)
        .attr("text-anchor", "end")
        .text(d => d.key);
//------------------------------------------Right side      
      var rightSlopeCircle = slopeGroups.append("circle")
      	.attr("r", config.radius)
      	.attr("cx", config.width)
      	.attr("cy", d => yScale(d.values[1].rank));
      
      var rightSlopeLabels = slopeGroups.append("g")
      	.attr("class", "slope-label-right")
      	.each(function(d) {
          d.xRightPosition = width + config.labelGroupOffset;
          d.yRightPosition = yScale(d.values[1].rank);
        });
      
      rightSlopeLabels.append("text")
      	.attr("class", "label-figure")
				.attr("x", d => d.xRightPosition)
				.attr("y", d => d.yRightPosition)
        .attr("dx", 10)
        .attr("dy", 3)
        .attr("text-anchor", "start")
        .text(d => (d.values[1].rank));
//-----append the chart here      
     	rightSlopeLabels.append("text")
				.attr("x", d => d.xRightPosition)
				.attr("y", d => d.yRightPosition)
        .attr("dx", config.labelKeyOffset)
        .attr("dy", 3)
        .attr("text-anchor", "start")
        .text(d => "");
//------------------------------------------Title and top part      
      var titles = svg.append("g")
      	.attr("class", "title");
      
      titles.append("text")
      	.attr("text-anchor", "end")
      	.attr("dx", -10)
      	.attr("dy", -margin.top / 2)
      	.text("Ground Truth");
      
      titles.append("text")
        .attr("text-anchor", "start")
      	.attr("x", config.width)
      	.attr("dx", -50)
      	.attr("dy", -margin.top / 2)
      	.text(this.props.model_name);
//------------------------------------------   
  }  
  render() {
    return (
      <div className="slopechart" style={{width:'100%'}} ref={node => this.node = node}></div>
    );
  }
}
export default SlopeChart;
