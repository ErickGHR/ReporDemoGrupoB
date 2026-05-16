import { useEffect, useState } from "react";

export default function DemoEffect(){
    const [hora, setHora ] = useState(new Date());

    useEffect(
        ()=>{
            const timer = setInterval(()=>{
                setHora(newDate())
            },
                1000);
            return () => clearInterval(timer)
        },[]
    );

    return <h1>
        {hora.toLocaleTimeString()}
    </h1>
}