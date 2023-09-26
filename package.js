import _ from "lodash";
import fs from "fs-extra";
import parseJSON from "json-parse-even-better-errors";

const pkg = async (packages) => {
  let manifest;

  try {
    manifest = await fs.readFileSync("./package.json", "utf-8");
  } catch (error) {
    throw new Error("File package.json is not found!");
  }

  try {
    manifest = parseJSON(manifest);
  } catch (error) {
    throw new Error(`Invalid package.json: ${error}`);
  }

  manifest.dependencies = _.omit(manifest.dependencies, packages);
  manifest.devDependencies = _.omit(manifest.devDependencies, packages);

  const { [Symbol.for("indent")]: indent, [Symbol.for("newline")]: newline } =
    manifest;

  const content = (JSON.stringify(manifest, null, indent) + "\n").replace(
    /\n/g,
    newline
  );

  await fs.writeFileSync("./package.json", content);
};

export default pkg;
