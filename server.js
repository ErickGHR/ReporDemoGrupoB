const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Usuario = require("./models/Usuario");

const app = express();
const port = 4100;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://202360435_user:mongobongo@cluster0.74cqvs5.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("MongoDB database service listo!"))
.catch(err => console.log(err));

app.get("/api/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios", error });
    }
});

app.post("/api/usuarios", async (req, res) => {
    try {
        const nuevo = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            genero: req.body.genero,
            plataformas: req.body.plataformas
        });

        const guardado = await nuevo.save();
        res.json(guardado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar usuario", error });
    }
});

app.put("/api/usuarios/:id", async (req, res) => {
    try {
        const actualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                email: req.body.email,
                genero: req.body.genero,
                plataformas: req.body.plataformas
            },
            { new: true }
        );

        if (!actualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar usuario", error });
    }
});

app.listen(port, () => {
    console.log("Listening at http://localhost:4100");
});