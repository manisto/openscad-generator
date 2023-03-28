import express from "express";
import bodyParser from "body-parser";
import { generate } from "./generate.mjs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/", (request, response) => {
    generate(request.body, (file) => {
        response.redirect(file);
    });
});

app.use(express.static("."));

app.listen(port, () => {
    console.log(`Now listening at port ${port}...`);
});