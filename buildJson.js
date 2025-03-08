import fs from "fs";
import map from "./indonesiaLow.js";

fs.writeFileSync("output.json", JSON.stringify(map))
