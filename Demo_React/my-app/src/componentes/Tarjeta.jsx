import hor from '../imagenes/hor.jpg'
import mi from '../imagenes/mi.jpg'
import ga from '../imagenes/ga.jpg'
import '../estilos/Tarjeta.css'

const imagenes = {
    hor, mi, ga
}

function Tarjeta(props){
    return(
        <div className="contenedor-tarjeta">
            <img 
                className="imagen-tarjeta"
                src={imagenes[props.imagen]} alt="Imagen de campeon ${props.nombre}" />
            <div className="contenedor-texto-tarjeta">
                <p className="titulo-tarjeta"><strong>{props.nombre}</strong></p>
                <p className="subtitulo-tarjeta">{props.region}</p>
                <p className="texto-tarjeta">{props.teto}</p>
            </div>
        </div>
    );
}

export default Tarjeta;