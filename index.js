#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

const projectName = process.argv[2] || "alchemia-js";
const projectPath = path.resolve(process.cwd(), projectName);
const templateLocation = path.resolve(__dirname, "template");

async function cloneTemplate() {
  try {
    await fs.copy(templateLocation, projectPath);
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
