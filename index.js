const canvas = d3.select(".canvas");
const svg = canvas.append("svg")
                    .attr("height", 600)
                    .attr("width", 600)

// append shapes to svg container
// the return value to the chained statement is the 
// element created

// GROUPS 
const group = svg.append("g")
    .attr("transform", "translate(150,100)")


// RECTANGLE
group.append("rect")
    .attr("width", 200)
    .attr("height", 100)
    .attr("fill", "blue");

// CIRCLE
group.append("circle")
    .attr("r", 30)
    .attr("cx", 250)
    .attr("cy", 50)
    .attr("fill", "orange");

// LINE
group.append("line")
    .attr("x1", 370)
    .attr("x2", 400)
    .attr("y1", 20)
    .attr("y2", 120)
    .attr("stroke", "red");

// TEXT
svg.append("text")
    .attr("x", "20")
    .attr("y", "200")
    .attr("fill", "grey")
    .text("Helo world")
    .style("font-family", "arial")
