import fs from "fs";
import path from "path";

const dir = "public/r";

for (const file of fs.readdirSync(dir)) {
  if (file === "registry.json") continue;
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (data.files) {
    data.files = data.files.map(({ content, ...rest }) => rest);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

console.log("✔ Stripped content from registry files.");