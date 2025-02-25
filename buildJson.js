import fs from "fs";
import map from "./indonesiaLow.js";

fs.writeFileSync("hello.json", JSON.stringify(map))
