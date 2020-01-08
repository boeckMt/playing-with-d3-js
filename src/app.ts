import * as d3 from 'd3';
import request from '~d3-request';
import GeoTIFF from '~geotiff';

d3.select('body');

console.log('d3.version', d3.version);

request("http://neo.sci.gsfc.nasa.gov/servlet/RenderData?si=189313&cs=rgb&format=TIFF&width=720&height=360").responseType("arraybuffer").get(function(error:any, request:any) {
  if (error) throw error;

  var tiff = GeoTIFF.parse(request.response),
      image = tiff.getImage(),
      values = image.readRasters()[0],
      m = image.getHeight(),
      n = image.getWidth();

  var color = d3.scaleSequential(d3.interpolateMagma)
      .domain(<any>d3.extent(values));

  var contours = d3.contours()
      .size([n, m])
      .smooth(false)
      .thresholds(20);

  d3.select("svg")
      .attr("viewBox", <any>[0, 0, n, m])
    .selectAll("path")
    .data(contours(values))
    .enter().append("path")
      .attr("d", d3.geoPath())
      .attr("fill", function(d:any) { return color(d.value); });
});
