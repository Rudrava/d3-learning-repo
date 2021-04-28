const svg = d3.select("svg")

d3.json("planets.json")
    .then(d => {
        const circles = svg.selectAll("circle")
            .data(d)
            // adding enter selection as it wont have any in dom GENERALLY
            .enter()
            .append("circle")
            .attr("r", d => d.radius)
            .attr("cy", 300)
            .attr("cx", d => d.distance)
            .attr("fill", d=> d.fill)
    })