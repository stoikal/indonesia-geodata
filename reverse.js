import fs from "fs"

const source = [
  [1],
  [2],
  [3],
]

const reversed = [...source].reverse();

try {
  fs.writeFileSync("reversed.json", JSON.stringify(reversed));
  console.log('File written successfully');
} catch (err) {
  console.error(err);
}