import fs from "fs";

const path = "./provinces/sumut.json"

const jsonString = fs.readFileSync(path, 'utf8');
const json = JSON.parse(jsonString);

const polygonFeatures = json.features;

const multiPolygonGeometry = {
  type: "MultiPolygon",
  coordinates: polygonFeatures.map((feature) => {
    return feature.geometry.coordinates
  })
}

const multiPolygonFeature = {
  ...polygonFeatures[0],
  geometry: multiPolygonGeometry,
}

const featureCollection = {
  ...json,
  features: [multiPolygonFeature]
}

const resultName = path.replace(/\.json$/, "-multi.json");

fs.writeFileSync(resultName, JSON.stringify(featureCollection))