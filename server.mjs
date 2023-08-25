import hbs from "hbs";
import url from "node:url";
import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import * as viewMappers from "./view-mappers.mjs";
import { generate } from "./generate.mjs";
import { resolveModelMap } from "./model-loader.mjs";

const modelMap = await resolveModelMap();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

const app = express();
const port = 3000;

const viewModelMap = new Map();
const flattenedParameterMap = new Map();

for (const [model, settings] of modelMap) {
    viewModelMap.set(model, {
        singleModelMode: modelMap.size === 1,
        groups: viewMappers.mapGroups(settings.groups),
        parameters: viewMappers.mapParameters(settings.parameters),
    });

    flattenedParameterMap.set(model, [
        ...settings.parameters,
        ...settings.groups?.flatMap(group => group.parameters) ?? [],
    ]);
};

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/select-model", (request, response) => {
    const selectedModel = request.body.selectedModel;
    response.redirect("/" + selectedModel);
});

app.post("/:model?", (request, response) => {
    const selectedModel = (modelMap.size === 1) ? modelMap.keys().next().value : request.params.model;
    const values = parseBody(selectedModel, request.body);

    generate(values)
        .then((file) => {
            console.log(file);
            response.redirect(file);
        })
        .catch((error) => {
            console.error(error);
            response.send(error);
        });
});

app.get('/:model?', (request, response) => {
    const selectedModel = (modelMap.size === 1) ? modelMap.keys().next().value : request.params.model;
    const viewModel = {
        ...viewModelMap.get(selectedModel),
        models: viewMappers.mapModels(modelMap, selectedModel),
        isModelSelected: !!selectedModel,
    };
    response.render('index', viewModel);
});

app.use(express.static("."));

app.listen(port, () => {
    console.log(`Now listening at port ${port}...`);
});

function parseBody(model, body) {
    const parsedParameters = {};
    const flattenedParameters = flattenedParameterMap.get(model);

    flattenedParameters.forEach(parameter => {
        switch (parameter.type) {
            case "number":
                parsedParameters[parameter.name] = Number(body[parameter.name]);
                break;
            case "string":
                parsedParameters[parameter.name] = body[parameter.name];
                break;
            case "boolean":
                parsedParameters[parameter.name] = !!body[parameter.name];
                break;
            default:
                console.error("Unknown type: " + parameter.type);
                break;
        }
    });

    return parsedParameters;
}
