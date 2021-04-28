const data = [
    { width: 200, height: 100, fill: "purple" },
    { width: 100, height: 60, fill: "pink" },
    { width: 50, height: 30, fill: "red" },
]
const svg = d3.select("svg")

// joining data from rect
const rect = svg.selectAll('rect')
    .data(data)

// attaching data to already existing dom selection
rect .attr("width", d => d.width)
    .attr("height", d => d.height)
    .attr("fill", d => d.fill)

// appending to dom selection
rect.enter()
    .append("rect")
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    .attr("fill", d => d.fill)

    console.log(rect)