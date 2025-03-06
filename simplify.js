import fs from "fs";
import simplify from "simplify-geojson";

const path = "./provinces/sumatra/_sumatra.json"

const jsonString = fs.readFileSync(path, 'utf8');
const json = JSON.parse(jsonString);


var simplified = simplify(json, 0.05)


const resultName = path.replace(/\.json$/, "-simplified.json");

fs.writeFileSync(resultName, JSON.stringify(simplified))