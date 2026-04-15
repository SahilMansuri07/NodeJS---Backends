import path from "path";
import fs from "fs";

const swaggerSpecPath = path.join(
  process.cwd(),
  "docs",
  "swagger",
  "validate-user.openapi.json",
);

const swaggerSpec = JSON.parse(fs.readFileSync(swaggerSpecPath, "utf8"));

export default swaggerSpec;
