// dimension for chart
const dims = {
  height: 300,
  width: 300,
  radius: 150,
};
// center for chart
const center = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

// svg
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 150)
  .attr("height", dims.height + 150);

// graph group
const graph = svg
  .append("g")
  .attr("transform", `translate(${center.x}, ${center.y})`);

// pie generator
const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);

// arc genrerator
const arcPath = d3.arc().outerRadius(dims.radius).innerRadius(50);

// ordinal scale
const color = d3.scaleOrdinal(d3["schemeSet3"]);

// legend setup
const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 40}, 10)`);
const legend = d3.legendColor().shape("circle").shapePadding(15).scale(color);

// tooltip setup
const tip = d3.tip().html((d) => {
  let content = `<div class="tip card" ><div class="name">Name: ${d.data.name}</div>
    <div class="cost">Cost: ${d.data.cost}</div>
    <div class="delete">Click on the slice to delete</div></div>`;
  return content;
});
graph.call(tip);

// update / draw
const update = (data) => {
  // update color domain
  color.domain(data.map((data) => data.name));
  legendGroup.call(legend).selectAll("text").attr("fill", "white");
  // join data to path elemets
  const path = graph.selectAll("path").data(pie(data));

  //   handle exit
  path.exit().transition().duration(750).attrTween("d", arcTweenExit).remove();

  // handle current dom updates
  path
    .attr("d", arcPath)
    .transition()
    .duration(750)
    .attrTween("d", arcTweenUpdate);

  // handle enter (virtual elements)
  path
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("stroke", "#1d1d1d")
    .attr("stroke-width", 3)
    //   note the data attached has passed from the pie generator
    //   the data is in d.data
    .attr("fill", (d) => color(d.data.name))
    .each(function (d) {
      // this gives us a ref to previous data to the current updated data
      this._current = d;
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter);

  // hover event
  // // mouse over
  graph
    .selectAll("path")
    .on("mouseover", (d, i, n) => {
      // the tip show takes data and current selection
      tip.show(d, n[i]);
      handleMouseOver(d, i, n);
    })
    // // mouse out
    .on("mouseout", (d, i, n) => {
      tip.hide();
      handleMouseOut(d, i, n);
    })
    // // mouseclick
    .on("click", handleClick);
};

// database conn
let data = [];
db.collection("expenses").onSnapshot((res) => {
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
        break;
      default:
        break;
    }
  });
  update(data);
});

// arcTweenEnter
const arcTweenEnter = (d) => {
  var i = d3.interpolate(d.endAngle, d.startAngle);
  return (t) => {
    d.startAngle = i(t);
    return arcPath(d);
  };
};
// arcTweenExit
const arcTweenExit = (d) => {
  var i = d3.interpolate(d.startAngle, d.endAngle);
  return (t) => {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// arcUpdateTween
function arcTweenUpdate(d) {
  // interpolating between the current and the updated obj
  const i = d3.interpolate(this._current, d);
  // update currnt with new updated data
  this._current = d;
  return (t) => {
    return arcPath(i(t));
  };
}

// event handlers
// mouse event
// the event attaches(data, index, current selection)
// //mouse over
const handleMouseOver = (d, i, n) => {
  // selecting the current doc
  d3.select(n[i])
    .transition("changeSliceFillToWhite")
    .duration(300)
    .attr("class", "arc hover");
};

// // mouse out
const handleMouseOut = (d, i, n) => {
  d3.select(n[i])
    .transition("changeSliceFillToMapped")
    .duration(300)
    // we use the color scale we created and as it already have a color mapped for the current selection
    // against its name so if we directly pass the data it gives us the color associated to it
    .attr("class", "arc");
};

const handleClick = (d) => {
  db.collection("expenses").doc(d.data.id).delete();
};

// =======CONCEPT
// if we name our transitions either by using constants or by passing the name string to the transition function
// .transition(<name>)
// .transition("name")
// what happens is d3 creates a namespace for the transition on the same element which allows every
// transition to run aloof without affecting each other as
// for our particular case when our path was growing if we hovered over it the hover was interrupting the path formation
// ie why we name spaced our transition and is a good practise
