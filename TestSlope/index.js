    var margin = {top: 100, right: 275, bottom: 40, left: 275};
    var width = 760 - margin.left - margin.right;
    var	height = 360 - margin.top - margin.bottom;
    var svg = d3.select(".container").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  
    var config = {xOffset: 0,yOffset: 0,width: width,height: height,
      labelPositioning: {alpha: 0.5,spacing: 18},
      leftTitle: "2013",rightTitle: "2016",labelGroupOffset: 5,labelKeyOffset: 50,radius: 3,
      // Reduce this to turn on detail-on-hover version
      unfocusOpacity: 0.3
    }
    function drawSlopeGraph(cfg, data, yScale, leftYAccessor, rightYAccessor) {
      var slopeGraph = svg.append("g")
      	.attr("class", "slope-graph")
      	.attr("transform", "translate(" + [cfg.xOffset, cfg.yOffset] + ")");     
    }
//------- This wont need anymore    
    var data={
      "pay_ratios_2012_13":[
      {
         "name":"Birkbeck",
         "rank":1
      },
      {
         "name":"LSE",
         "rank":2
      },
      {
         "name":"London Met",
         "rank":3
      },
      {
         "name":"LSHTM",
         "rank":4
      }
   ],
   "pay_ratios_2015_16":[
      {
         "name":"Birkbeck",
         "rank":1
      },
      {
         "name":"LSE",
         "rank":1
      },
      {
         "name":"London Met",
         "rank":1
      },
      {
         "name":"LSHTM",
         "rank":1
      }
   ]
}
// Combine ratios into a single array
      var ratios = [];
      data.pay_ratios_2012_13.forEach(function(d) {ratios.push(d);});
      data.pay_ratios_2015_16.forEach(function(d) {ratios.push(d);});
      
      var nestedByName = d3.nest().key(function(d) { return d.name }).entries(ratios);
      console.log(nestedByName)
      var y1Min = d3.min(nestedByName, function(d) {        
        return Math.min(d.values[0].rank, d.values[1].rank);
      });
      
      var y1Max = d3.max(nestedByName, function(d) {        
        return Math.max(d.values[0].rank, d.values[1].rank);
      });
//----------------     
      // Calculate y domain for ratios
      console.log(y1Min,y1Max)
      var yScale = d3.scaleLinear().range([0,height]).domain([y1Min, y1Max]);
      //var yScale = d3.scaleLinear().range([height, 0]).domain([1, 18]);

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
      	.text(config.leftTitle);
      
      titles.append("text")
      	.attr("x", config.width)
      	.attr("dx", 10)
      	.attr("dy", -margin.top / 2)
      	.text(config.rightTitle);
//------------------------------------------   