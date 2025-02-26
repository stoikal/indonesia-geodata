// import './style.css'
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import indonesiaLow from "indonesia-geodata/indonesiaLow";

let root = am5.Root.new("app");
let chart = root.container.children.push(
  am5map.MapChart.new(root, {
    projection: am5map.geoMercator()
  })
);
let polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: indonesiaLow
  })
);
