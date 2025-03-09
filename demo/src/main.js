// import './style.css'
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import indonesiaSimplified from "indonesia-geodata/indonesiaSimplified";

const root = am5.Root.new("app");

const chart = root.container.children.push(
  am5map.MapChart.new(root, {
    projection: am5map.geoMercator()
  })
);

chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: indonesiaSimplified
  })
);
