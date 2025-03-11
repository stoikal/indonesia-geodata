# Indonesia Geodata

This package contains GeoJSON data representing the 38 provinces of Indonesia. Each province is represented as a `Feature` within a `FeatureCollection`. The `Feature`'s geometry is either a `Polygon` or `MultiPolygon`.

## Feature Properties

Each `Feature` has the following properties:

* **`id`:** (String) The ISO 3166-2:ID code for the province.
* **`name`:** (String) The province name in Indonesian.
* **`NAME_ENG`:** (String) The province name in English.
* **`CNTRY`:** (String) The Country name (Indonesia)
* **`TYPE`:** (String) The province type in Indonesian (e.g., "Provinsi", "Daerah Istimewa").
* **`TYPE_ENG`:** (String) The province type in English (e.g., "Province", "Special Region").
* **`REGION_CODE`** (String) Kemendagri Regional Code (e.g., "34")
  
  
## Example Feature

```json
{
  "type": "Feature",
  "id": "ID-AC",
  "properties": {
    "name": "Aceh",
    "id": "ID-AC",
    "NAME_ENG": "Aceh",
    "CNTRY": "Indonesia",
    "TYPE": "Provinsi",
    "TYPE_ENG": "Province",
    "REGION_CODE": "11"
  },
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      // ... coordinates ...
    ]
  }
}
```
  
  
## Available Maps:
|name|size|preview|
|---|---|---|
|indonesiaHigh|~200 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaHigh.json&map=4/-4/119)|
|indonesiaMedium|~100 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaMedium.json&map=4/-4/119)|
|indonesiaLow|~50 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaLow.json&map=4/-4/119)|
|indonesiaSimplified|~25 KiB|[link](https://geojson.io/#id=github:stoikal/indonesia-geodata/blob/main/json/indonesiaSimplified.json&map=4/-4/119)|  
   
  
## Usage
The map data can be imported as a JavaScript object:
```
import indonesiaLow from "indonesia-geodata/indonesiaLow";
```
Alternatively, the GeoJSON data is also available as a JSON file in the `json/` directory.
  
  
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
