// @TODO: YOUR CODE HERE!
// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 850;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
svg = d3.selectAll("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`)
    
// Import Data
d3.csv("./data/data.csv").then(function(healthData){
    console.log(healthData);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function (data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        // console.log(data.poverty);
        // console.log(data.healthcare);
    })
    
    // Step 2: Create scale functions
    // ==============================
    xTimeScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);
    console.log(d3.max(healthData, d => d.poverty));

    yTimeScale = d3.scaleLinear()
        .domain([2, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);
    console.log(d3.max(healthData, d => d.healthcare));

    // Step 3: Create axis functions
    // ==============================
    xAxis = d3.axisBottom(xTimeScale);
    yAxis = d3.axisLeft(yTimeScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

    chartGroup.append("g")
        .call(yAxis)
    
    var states = healthData.map(d => d.abbr)
    console.log(states)
    var povertys = healthData.map(d => d.poverty)
    var health = healthData.map(d => d.healthcare)
    
    // Step 5: Create Circles
    // ==============================
    var circleGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.poverty))
        .attr("cy", d => yTimeScale(d.healthcare))
        .attr("r", "15")
        // .attr("fill", "pink")
        .classed("stateCircle", true)
        // .text(function(d){return d.abbr})

        
       
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
            .attr("class", "d3-tip") 
            // .classed("d3-tip", true)
            .offset([80, -60])
            .html(function(d){
                return (`<strong>${d.state}<strong>
                <br>poverty: ${d.poverty}%
                <br>Lacks Healthcare: ${d.healthcare}%`)
            })

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip)

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circleGroup.on("mouseover", function(d){
        toolTip.show(d, this)
        })
         .on("mouseout", function(d){
              toolTip.hide(d)
            });



  /////Insert Text Inside the Circle///////////
        /// This kind of works/////
        chartGroup.selectAll("circle")//.append("text")
        .text(function(d){return d.abbr})
        // .attr("dx", function(d){ return xTimeScale(d[curX]) })
        .attr("dx", 10)
        .attr("font-size", "11px")
        .attr("fill", "black")

        svg.append("g")
            .selectAll("circle")
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", (d) => {return xTimeScale(d.poverty + 1.07)})
            .attr("y", (d) => {return yTimeScale(d.healthcare - 2.5)})
            .text(function(d){return d.abbr})
            .attr("class", "stateText")




    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");


}).catch(function(error){
    console.log(error);
})

