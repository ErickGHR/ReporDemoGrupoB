import { Router } from "express";
import  crearSesionPago  from "../controllers/pago-controller.js";
const router = Router();

router.get("/pagar", crearSesionPago);
router.get("/exito", (req, res)=>res.send("Exito con el apgo"));
router.get("/cancelado", (req, res)=>res.send("Pago cancelado"));

export default router;