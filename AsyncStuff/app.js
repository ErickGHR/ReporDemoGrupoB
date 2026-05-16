/*const showMessage = () => {
    setTimeout(()=>{
        console.log("Hello");
    },3000);
    
}
showMessage();
console.log("Nuevo mensaje")

async function tarea() {
    return "asynchronous task"
    
}

async function ejecuta() {
    const respuesta= await tarea();
    console.log(respuesta);
    
}

ejecuta();

//promises -> tres estados: peding, fulfilled, rejected

const promesa = new Promise(
    (resolve, reject)=>{
        const todobien = true;
        setTimeout(
            if(todobien){
                resolve("Todo está muy bien!");
            }else{
                reject("Todo mal");
            }
        );
    }
);
console.log(promesa);

const promesaUno= new Promise(
    (resolve, reject)=>{
        resolve("Promesa Tres fallida");
    }
);

promesaUno
.then(
    (res)=>{ console.log(res);
        return promesaDos;
    }
)
.then(
    (e)=>{ 
         (res)=>{ console.log(res);
        return promesaTres;
    }
        
    }
    
)
.catch(
    (e)=>{ 
        console.log(e);
        
    }

)


//Otra forma
promesaUno.then(
    (respuesta)=>{
        console.log(respuesta);
        promesaDos.then(
            (respuesta)=>{
                console.log(respuesta2);
                promesaTres.then(
                (respuesta3)=>{console.log(respuesta3)}
                ).catch(
                    (error)=>{
                        console.log(error)
                    }
                )
            }
        )
    }
)
*/

async function fetchPokemon() {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
    const datos = await respuesta.json();
    console.log(datos.results[0].url);
    const detalles = await fetch(datos.results[0].url);
    const datos_detalles = await detalles.json();
    console.log(datos_detalles);
    const col= document.createElement("div");  
    col.className="col-md-4 col-lg-3";
    col.innerHTML = {}`
    <div class="card h-100 shadow-lg bg-secondary text-white">
        <img src="${datos_detalles.sprites.other['official-artwork'].front_default}"
        class="card-img-top p-3"
        alt ="${datos_detalles.name}"
        div   
    </div> 
    `
} 

fetchPokemon();
