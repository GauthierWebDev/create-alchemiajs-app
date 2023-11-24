#!/usr/bin/env node

const shell = require("shelljs");
const path = require("path");

const rawProjectPath = process.argv[2] || "alchemia-js";
const projectPath = path.resolve(process.cwd(), rawProjectPath);

async function cloneTemplate() {
  const repo = "https://github.com/GauthierWebDev/AlchemiaJS.git";
  const projectName = path.basename(projectPath);

  try {
    console.log(`- Cloning template from ${repo} into ${projectPath}...`);
    shell.exec(`git clone ${repo} ${projectPath}`, { silent: true });

    if (projectName !== "alchemia-js") {
      console.log(
        `- Updating package.json with project name "${projectName}"...`
      );
      shell.sed(
        "-i",
        '"name": "alchemia-js"',
        `"name": "${projectName}"`,
        `${projectPath}/package.json`
      );
    }

    console.log("- Removing template .git directory...");
    shell.rm("-rf", `${projectPath}/.git`);

    console.log(
      `\nCreated project "${projectName}" at ${projectPath}!\nHappy alchemizing! 🧪`
    );
  } catch (error) {
    throw new Error(`Error copying template: ${error.message}`);
  }
}

async function createApp() {
  try {
    await cloneTemplate();
  } catch (error) {
    throw new Error(`Error creating app: ${error.message}`);
  }
}

createApp();
