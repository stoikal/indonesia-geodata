import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import indonesiaLow from "indonesia-geodata/indonesiaLow";

const root = am5.Root.new("amchart-map");

const chart = root.container.children.push(
  am5map.MapChart.new(root, {
    projection: am5map.geoMercator()
  })
);

const polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: indonesiaLow
  })
);

polygonSeries.mapPolygons.template.setAll({
  tooltipText: "{name}",
  interactive: true,
});

polygonSeries.mapPolygons.template.states.create("hover", {
  fill: am5.color(0x164c75)
});


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
