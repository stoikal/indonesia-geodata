# Indonesia Geodata

Indonesia Map with 38 Provinces

## Available Maps:
|name|size|preview|
|---|---|---|
|indonesiaHigh|~200 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaHigh.json&map=4/-4/119)|
|indonesiaMedium|~100 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaMedium.json&map=4/-4/119)|
|indonesiaLow|~50 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaLow.json&map=4/-4/119)|
|indonesiaSimplified|~25 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaSimplified.json&map=4/-4/119)|  
   
  
## Example Usage with Amchart 5:
```
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import indonesiaLow from "indonesia-geodata/indonesiaLow";

// Create root and chart
let root = am5.Root.new("chartdiv"); 
let chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "rotateX",
    projection: am5map.geoNaturalEarth1()
  })
);

// Create polygon series
let polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: indonesiaLow
  })
);

```    
  
## Example Usage with Leaflet:
```
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = L.map("leaflet-map").setView([-3, 120], 4);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.geoJSON(indonesiaLow, {
  onEachFeature: function (feature, layer) {
    layer.on('click', function (e) {
      const { properties } = feature;

      layer.bindPopup(properties.name).openPopup();
      console.log(properties);
    });
  }
}).addTo(map);

```
