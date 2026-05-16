import { useState } from "react";

export function Contador(){
    const [contador, setCotandor] = useState(0);
    const Incrementa = ()=>{setCotandor (contador + 1)}
    const Decrementa = ()=>{setCotandor(contador -1 )}
    return(
        <div>
            <h1>{contador}</h1>
            <button onClick={Incrementa}>Incrementa</button>
            <button onClick={Decrementa}>Decrementa</button>
        </div>

    );
}

