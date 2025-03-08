import * as fs from "fs/promises";
import path from "path";

const [dirPath] = process.argv.slice(2);

async function readNestedJSON(dirPath, results = []) {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await readNestedJSON(filePath, results); 
      } else if (stats.isFile() && file.toLowerCase().endsWith('.json')) {
        try {
          const fileContent = await fs.readFile(filePath, 'utf8');
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

    await fs.writeFile(filePath, jsonString, 'utf8');
    console.log(`JSON data written to ${filePath}`);
  } catch (err) {
    console.error(`Error writing JSON file: ${err}`);
  }
}

async function main () {
  const files = await readNestedJSON(dirPath);
  
  const featureCollection = {
    type: "FeatureCollection",
    features: files.reduce((result, { data }) => {
      return [...result, ...data.features]
    }, []),
  }
  
  writeJSONFile('./build/merged.json', featureCollection)
}

main()
