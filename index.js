const svg = d3.select(".canvas")
    .append("svg")
    .attr("width", "100%")
    .attr("height", 600)

// create margins and dimensions
const margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
}

// creating graph margin
const graphWidth = 600 - margin.left - margin.right
const graphHeight = 600 - margin.top - margin.bottom

// creating graph group
const graph = svg.append("g")
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Xaxis group
const xAxisGroup = graph.append("g")
                .attr("transform", `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append("g")

d3.json("menu.json")
    .then(data => {
        // getting the min and max for data
        // const min = d3.max(data, d => d.orders)
        // const max = d3.max(data, d => d.orders)
        // const extent = d3.extent(data, d => d.orders)
        // console.log(min, max, extent)
        
        // scales
        const y = d3.scaleLinear()
            .domain([0,d3.max(data, d => d.orders) + 100])
            // as the graph height is calculated in order to fit it at the graph bottom we need the height of the graph
            .range([graphHeight, 0])
        const x = d3.scaleBand()
            .domain(data.map(item => item.name))
            .range([0,600])
            .paddingInner(0.2)
            .paddingOuter(0.2)
        
        
        // join data to rect
        const rects = graph.selectAll("rect")
            .data(data)

        // DOM selection
        // rects
        //     .attr("width", x.bandwidth)
        //     .attr('height', graphHeight - y(d.orders))
        //     .attr("fill", "orange")
        //     .attr("x", d=> x(d.name))
        // .attr("y", d => y(d.orders))
    
        // ENTER Selection
        rects
            .enter()
            .append("rect")
            .attr("width", x.bandwidth)
            .attr('height', d => graphHeight - y(d.orders))
            .attr("fill", "orange")
            .attr("y", d => y(d.orders))
            .attr("x", d => x(d.name))
        
        // create and call the axes
        const xAxis = d3.axisBottom(x)
        const yAxis = d3.axisLeft(y)
                    .ticks(3)
                    .tickFormat(d => `${d} orders`)
        //this generates and adds svg for the axis
        xAxisGroup.call(xAxis)
        yAxisGroup.call(yAxis)

        // transforming xAxisGroup
        xAxisGroup.selectAll("text")
            .attr("transform", "rotate(-45)")
            // it rotated with text andchor
            .attr('text-anchor',"end")
    })