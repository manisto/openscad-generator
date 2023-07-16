import { promisify } from "node:util";
import { exec } from "node:child_process";
import path from "node:path";

export function generate(values) {
    const inFile = path.join("data", "model.scad");
    const outFile = fname(values);
    const command = ["openscad", "-o", `"${outFile}"`, ...params(values), `"${inFile}"`];

    return new Promise((resolve, reject) => {
        exec(command.join(" "), (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(outFile);
            }
        });
    });
}

function params(params) {
    return Object.keys(params).flatMap(key => ["-D", `"${key}=${tick(params[key])}"`]);
}

function tick(value) {
    switch (typeof value) {
        case "number":
        case "boolean":
            return `${value}`;
        case "string":
            return `\\"${value}\\"`;
        default:
            throw new Error("Unsupported type: " + typeof value);
    }
}

function fname(params) {
    return path.join("out", `${dash(params.material)}_${dash(params.brand)}_${dash(params.name)}.stl`);
}

function dash(name) {
    return name.replace(/[^0-9a-z ]/gi, "").trim(" ");
}