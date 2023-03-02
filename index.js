import express from 'express';
import {v4 as uuid} from 'uuid';
import cors from 'cors';
import {create} from 'express-handlebars';
import fileUpload from 'express-fileupload';
import fs from 'fs';

import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.listen(3000, () => console.log("http://localhost:3000"));

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "La imágen que está subiendo sobrepasa los 5mb permitidos."
  }));
  app.use(cors());
  app.use('/public', express.static('public'))

//configuracion de handlebars

const hbs = create({
	partialsDir: [
		"views/partials/",
	],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//FUNCIONES
const leerProductos = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("productos.json", "utf8", (error, data) => {
            if(error) return reject("Ha ocurrido un error al cargar los productos.");
            let productos = JSON.parse(data)
            resolve(productos.productos)
        })
    })
}

//RUTAS

app.get("/", (req, res) => {
    leerProductos().then(productos=> {
        res.render("home", {
            productos
        });
    }).catch(error => {
        res.render("home", {
            error
        });
    })
})