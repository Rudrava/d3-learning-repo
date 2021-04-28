const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", "100%")
  .attr("height", 600);

// create margins and dimensions
const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100,
};

// creating graph margin
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

// creating graph group
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Xaxis group
const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append("g");

// scales
const y = d3
  .scaleLinear()
  // as the graph height is calculated in order to fit it at the graph bottom we need the height of the graph
  .range([graphHeight, 0]);
const x = d3.scaleBand().range([0, 600]).paddingInner(0.2).paddingOuter(0.2);

// create and call the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(3)
  .tickFormat((d) => `${d} orders`);

// transforming xAxisGroup text
xAxisGroup
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  // it rotated with text andchor
  .attr("text-anchor", "end");

// TRANSITION change duration here to see the
const barTransition = d3.transition().duration(1550);

// UPDATE FUNCTION: takes updated or initian data
const update = (data) => {
  // updating scale domains
  y.domain([0, d3.max(data, (d) => d.orders) + 100]);
  x.domain(data.map((item) => item.name));

  // join data to rect
  const rects = graph.selectAll("rect").data(data);

  // remove exit selections
  rects.exit().remove();

  //update or init DOM selections
  rects
    .attr("width", x.bandwidth)
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    // transition
    .transition(barTransition)
    // ending conditions for the rect[after transitions]
    .attr("y", (d) => y(d.orders))
    .attr("height", (d) => graphHeight - y(d.orders));

  // ENTER Selections
  rects
    .enter()
    .append("rect")
    //starting conditions for the rect[before anim]
    .attr("y", graphHeight)
    .attr("height", 0)
    .attr("width", x.bandwidth)
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    // what the line below does is it merges the dom selection and enter selection and the
    // code following it would be applied to both the selections
    // transition
    .transition(barTransition)
    // ending conditions for the rect[after transitions]
    .attrTween("width", widthTween)
    .attr("y", (d) => y(d.orders))
    .attr("height", (d) => graphHeight - y(d.orders));

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

// snapshot listener and attaching data to draw
let data = [];
db.collection("dishes").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };
    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id === doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
    }
  });
  update(data);
});

// ==========CONCEPT============
//   THE D3 UPDATE PATTERN
// const update = (data) => {
//   UPDATE ANY SCALE [DOMAIN] IF THEY RELY ON THE DATA
// y.domain([0, d3.max(data => d.orders)])
//   JOIN THE UPDATED DATA TO ELEMENTS
// const rects = graph.selectAll("rect").data(data);
//   REMOVE ANY UNWANTED SHAPES (EXITING)
// rects.exit().remove()
//   UPDATE EXISTING DOM SELECTIONS
// rects.attr(...etc)
//   APPEND THE ENDTER SELECTION TO THE DOM
// rects.enter().append("rect").attr(...etc)
// };

// ==========CONCEPT============
// TRANSITIONS OR ANIMS

// FOR OUR PARTICULAR BAR CHART

// starting conditions
// height = 0
// y = graphHeight

// ending conditions
// height = graphHeight - y(d.orders)
// y =  y(d.orders)

const widthTween = (d) => {
  // define interpolation
  let inter = d3.interpolate(0, x.bandwidth());
  return (t) => inter(t);
};
