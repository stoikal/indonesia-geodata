import * as fs from "fs/promises";
import path from "path";
import mapshaper from "mapshaper";

const [dirPath] = process.argv.slice(2);

const dTs = "declare const map: GeoJSON.FeatureCollection;\nexport default map;"

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
    const jsonString = JSON.stringify(jsonData, null, 2); // Convert JSON object to string

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
    const inputFileContent = await fs.readFile(inputFilePath, "utf8");

    const commands = [
      `-i ${inputFilePath}`,
      `-simplify ${simplificationPercentage}% weighted keep-shapes`,
      "-snap",
      "-clean",
      `-o ${outputFilePath} format=geojson precision=0.0001`,
    ];

    const commandString = commands.join(" ");

    await mapshaper.runCommands(commandString);

    console.log(`GeoJSON simplified and saved to ${outputFilePath}`);
  } catch (err) {
    console.error(`Error simplifying GeoJSON: ${err}`);
  }
}

async function main () {
  const merged = await merge();
  
  await writeJSONFile("./merged.json", merged);

  simplifyGeoJSON("./merged.json", "./json/indonesiaHigh.json", 90);
  simplifyGeoJSON("./merged.json", "./json/indonesiaMedium.json", 40);
  simplifyGeoJSON("./merged.json", "./json/indonesiaLow.json", 10.4);
}

main()
