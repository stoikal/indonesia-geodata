import * as fs from "fs/promises";
import path from "path";
import mapshaper from "mapshaper";
import { rewindFeatureCollection } from "@placemarkio/geojson-rewind"

const [dirPath] = process.argv.slice(2);

const dTs = "declare const map: GeoJSON.FeatureCollection;\nexport default map;"

const target = [
  ["indonesiaHigh", 87],
  ["indonesiaMedium", 41],
  ["indonesiaLow", 17],
  ["indonesiaSimplified", 6],
]

async function main() {
  const merged = await merge();

  await writeJSONFile("./merged.json", merged);

  await Promise.all(
    target.map(([key, simplificationPercentage]) => {
      return simplifyGeoJSON("./merged.json", `./json/${key}.json`, simplificationPercentage);
    })
  );

  await Promise.all(
    target.map(([key]) => {
      return rewindGeoJson(`./json/${key}.json`, `./json/${key}.json`);
    })
  );

};

main();

async function readNestedJSON(dirPath, results = []) {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await readNestedJSON(filePath, results); 
      } else if (stats.isFile() && file.toLowerCase().endsWith(".json")) {
        try {
          const fileContent = await fs.readFile(filePath, "utf8");
          const jsonData = JSON.parse(fileContent);
          results.push({
            filePath: filePath,
            data: jsonData,
          });
        } catch (jsonError) {
          console.error(`Error parsing JSON in ${filePath}: ${jsonError}`);
        }
      }
    }
    return results;
  } catch (err) {
    console.error(`Error reading directory ${dirPath}: ${err}`);
    return [];
  }
}

async function writeJSONFile(filePath, jsonData) {
  try {
    const jsonString = JSON.stringify(jsonData, null); // Convert JSON object to string

    await fs.writeFile(filePath, jsonString, "utf8");
    console.log(`JSON data written to ${filePath}`);
  } catch (err) {
    console.error(`Error writing JSON file: ${err}`);
  }
}

async function merge() {
  const files = await readNestedJSON(dirPath);
  
  const featureCollection = {
    type: "FeatureCollection",
    features: files.reduce((result, { data }) => {
      return [...result, ...data.features]
    }, []),
  }

  return featureCollection;
}

async function simplifyGeoJSON(inputFilePath, outputFilePath, simplificationPercentage) {
  try {
    const commands = [
      `-i ${inputFilePath}`,
      `-simplify ${simplificationPercentage}% weighted keep-shapes`,
      `-o ${outputFilePath} format=geojson precision=0.0001`,
    ];

    const commandString = commands.join(" ");

    await mapshaper.runCommands(commandString);

    console.log(`GeoJSON simplified and saved to ${outputFilePath}`);
  } catch (err) {
    console.error(`Error simplifying GeoJSON: ${err}`);
  }
}

async function rewindGeoJson(inputFilePath, outputFilePath, winding = "d3") {
  const fileContent = await fs.readFile(inputFilePath, "utf8");
  const jsonData = JSON.parse(fileContent);

  const rewound = rewindFeatureCollection(jsonData, winding);

  await writeJSONFile(outputFilePath, rewound);
}
