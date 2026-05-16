const express = require("express");
const app = express();
const port = 3600; // 0 - 1024 son puertos reservados
app.use(express.json());

let pokemones = [
    {id:1, name:"Charizar", type:"Fire"},
    {id:2, name:"Blasstoise", type:"Water"},
    {id:3, name:"Pikachu", type:"Electric"}
];

//route root
app.get("/",(req, res)=>{
    return res.send("Hola mundo desde Node Backed");
});

//route pokemon
app.get("/pokemones",(req,res)=>{
    return res.json(pokemones);
});

app.get("/pokemon/3",(req, res)=>{
    return res.json([pokemones[2]]);
});

app.post("/alta-pokemon", (req, res)=>{
    let nuevo_pokemon = {
        id:pokemones.length+1,
        name:req.body.name,
        type:req.body.type
    };
    pokemones.push(nuevo_pokemmon);
    return  res.status(200).json(pokemones);
});

app.listen(port,()=>{
    console.log("Servidor ejecutanse en localhost"+port);
});