#!/usr/bin/env node

import _ from "lodash";
import fs from "fs";
import depcheck from "depcheck";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { execa } from "execa";
import pkg from "./package.js";

let depCheckOptions = {};

try {
  const config = fs.readFileSync("./prune.json", { encoding: "utf-8" });
  const parseConfig = JSON.parse(config);

  if (_.isObject(parseConfig)) {
    depCheckOptions = _.merge(depCheckOptions, parseConfig);
  }
} catch (err) {
  console.log("No prune.json config provided! Using default config.");
}

const DEPS = {
  dependencies: `${chalk.bold.underline.red("Unused dependencies: ")}`,
  devDependencies: `${chalk.bold.underline.red("Unused devDependencies: ")}`,
};

const OPTS = {
  usage: "View usage of dependencies",
  prune: "Prune dependencies",
};

const unselectable = (opts) =>
  new inquirer.Separator(chalk.reset(opts ? opts.title : " "));

const spinner = ora("Analyzing project npm dependencies...\n");
spinner.start();

depcheck(process.cwd(), depCheckOptions).then((unused) => {
  const unusedDependencies = _.get(unused, "dependencies", []);
  const unusedDevDependencies = _.get(unused, "devDependencies", []);

  const deps = {
    dependencies: unusedDependencies,
    devDependencies: unusedDevDependencies,
  };

  const usageOfDependecies = _.get(unused, "using", {});
  let usageByDependency = _.chain(usageOfDependecies)
    .entries()
    .map(([key, value]) => ({ name: key, count: value?.length || 0 }))
    .value();

  usageByDependency = _.orderBy(_.values(usageByDependency), ["count"], ["desc"]);

  const optChoices = [unselectable()];
  const opts = _.values(OPTS);
  _.forEach(opts, (opt) => {
    optChoices.push({ name: opt });
  });
  optChoices.push(unselectable());
  optChoices.push(
    unselectable({ title: "Enter to proceed. Control-C to cancel." })
  );

  const optQuestion = [
    {
      name: "options",
      message: "Select an action.",
      type: "list",
      choices: optChoices,
      pageSize: process.stdout.rows - 2,
    },
  ];

  spinner.stop();

  inquirer
    .prompt(optQuestion)
    .then(async (answers) => {
      if (answers?.options === OPTS.usage) {
        console.log(`${chalk.bold.underline.green("Dependecies usage: ")} \n`);
        _.forEach(usageByDependency, (dep) => {
          const depName = _.get(dep, "name", "");
          const depCount = _.get(dep, "count", 0);
          if (depName) {
            console.log(
              `${chalk.bold.underline.green(depName)}: used in ${
                depCount
              } file/s.`
            );
          }
        });
      }

      if (answers?.options === OPTS.prune) {
        const pruneChoices = [unselectable()];

        if (_.keys(DEPS)?.length) {
          _.mapKeys(deps, (values, key) => {
            pruneChoices.push(unselectable({ title: DEPS[key] }));
            if (_.isArray(values)) {
              _.map(values, (value) => pruneChoices.push({ name: value }));
            }
            if (_.isPlainObject(values)) {
              _.chain(values)
                .keys()
                .map((value) => pruneChoices.push({ name: value }));
            }
            pruneChoices.push(unselectable());
          });
        }

        pruneChoices.push(
          unselectable({
            title:
              "Space to select. Enter to start pruning. Control-C to cancel.",
          })
        );

        const pruneQuestion = [
          {
            name: "packages",
            message: "Choose which packages to remove.",
            type: "checkbox",
            choices: pruneChoices,
            pageSize: process.stdout.rows - 2,
          },
        ];

        inquirer
          .prompt(pruneQuestion)
          .then(async (answers) => {
            const { packages } = answers;

            if (!packages || !packages.length) {
              console.log("No packages provided.");
              return false;
            }

            await pkg(packages);

            const spinner = ora(`Pruning using ${chalk.green("npm prune")}...`);
            spinner.start();

            execa("npm", ["prune"])
              .then((output) => {
                spinner.stop();
                console.log(output.stdout);
                console.log(output.stderr);

                console.log(chalk.green(`Prune complete!`));
              })
              .catch((err) => {
                spinner.stop();
                throw err;
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
