import hbs from "hbs";
import url from "node:url";
import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import * as viewMappers from "./view-mappers.mjs";
import { generate } from "./generate.mjs";
import { settings } from "./data/settings.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

const app = express();
const port = 3000;

const viewModel = {
    groups: viewMappers.mapGroups(settings.groups),
    parameters: viewMappers.mapParameters(settings.parameters),
};

const allParameters = [
    ...settings.parameters,
    ...settings.groups?.flatMap(group => group.parameters) ?? [],
];

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/", (request, response) => {
    const values = parseBody(request.body);

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

app.get('/', (request, response) => {
    response.render('index', viewModel);
});

app.use(express.static("."));

app.listen(port, () => {
    console.log(`Now listening at port ${port}...`);
});

function parseBody(body) {
    const parsedParameters = {};

    allParameters.forEach(parameter => {
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
