import * as d3 from 'd3';

d3.select('body');


console.log('d3.version', d3.version);
//layout
const width = 960;
const height = 480;

let svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

let plotMargins = {
  top: 30,
  bottom: 30,
  left: 150,
  right: 30
};
let plotGroup = svg.append('g')
  .classed('plot', true)
  .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

let plotWidth = width - plotMargins.left - plotMargins.right;
let plotHeight = height - plotMargins.top - plotMargins.bottom;


//x-axis
let xScale = d3.scaleTime()
  .range([0, plotWidth]);
let xAxis = d3.axisBottom(xScale);
let xAxisGroup = plotGroup.append('g')
  .classed('x', true)
  .classed('axis', true)
  .attr('transform', `translate(${0},${plotHeight})`)
  .call(xAxis);

//y-axis
let yScale = d3.scaleLinear()
  .range([plotHeight, 0]);
let yAxis = d3.axisLeft(yScale);
let yAxisGroup = plotGroup.append('g')
  .classed('y', true)
  .classed('axis', true)
  .call(yAxis);

//Finally, let’s add a group to contain our points:
let pointsGroup = plotGroup.append('g')
  .classed('points', true);

let data = d3.json<any>('https://api.reddit.com');

data.then((data) => {
  let prepared = data.data.children.map((d: any) => {
    return {
      date: new Date(d.data.created * 1000),
      score: d.data.score
    }
  });

  console.log(prepared)

  //Updating scales and axes
  let x_ext: any = d3.extent(prepared, (d: any) => d.date);
  xScale.domain(x_ext).nice();
  xAxisGroup.call(xAxis);
  let y_ext: any = d3.extent<number>(prepared, (d: any) => d.score);
  yScale.domain(y_ext).nice();
  yAxisGroup.call(yAxis);

  //Drawing the points
  var dataBound = pointsGroup.selectAll('.post')
    .data(prepared);

  // delete extra points
  dataBound
    .exit()
    .remove();

  // add new points
  var enterSelection = dataBound
    .enter()
    .append('g')
    .classed('post', true);


  // update all existing points
  enterSelection.merge(dataBound)
    .attr('transform', (d: any, i) => `translate(${xScale(d.date)},${yScale(d.score)})`);


  //We now need to add points to our chart.
  enterSelection.append('circle')
    .attr('r', 2)
    .style('fill', 'blue');


}, (error) => {
  console.log(error);
})
