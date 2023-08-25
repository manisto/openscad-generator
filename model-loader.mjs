import url from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export async function resolveModelMap() {
    const modelMap = new Map();
    const modelsDir = path.join(__dirname, "models");
    const modelsFolderEntries = await fs.readdir(modelsDir, { withFileTypes: true });
    const modelFolders = modelsFolderEntries.filter(entry => entry.isDirectory);

    const settingsFileResults = await Promise.allSettled(modelFolders.map(entry => {
        const settingsFile = path.join(modelsDir, entry.name, "settings.mjs");
        return import(url.pathToFileURL(settingsFile));
    }));

    const modelFileResults = await Promise.allSettled(modelFolders.map(entry => {
        const modelFile = path.join(modelsDir, entry.name, "model.scad");
        return fs.access(modelFile, fs.constants.F_OK);
    }));

    modelFolders.forEach((entry, index) => {
        const hasSettings = settingsFileResults[index].status === "fulfilled";
        const hasModel = modelFileResults[index].status === "fulfilled";

        if (!hasSettings || !hasModel) {
            console.warn(`Model folder "${entry.name}" is missing settings or model, skipping`);
            return;
        }

        modelMap.set(entry.name, settingsFileResults[index].value.settings);
    });

    return modelMap;
}