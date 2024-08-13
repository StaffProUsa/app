import { SPage } from 'servisofts-component';
import root from './root';

import ventas_por_evento from "./ventas_por_evento";
import ventas_por_evento_detalle from "./ventas_por_evento_detalle";
import ventas_por_evento_grafico from "./ventas_por_evento_grafico";

import entradas_por_evento from "./entradas_por_evento";
import visitas_por_evento from "./visitas_por_evento";
import mesas_por_evento from "./mesas_por_evento";


export default SPage.combinePages("reportes", {
    "": root,
    ventas_por_evento,
    ventas_por_evento_detalle,
    ventas_por_evento_grafico,

    entradas_por_evento,
    mesas_por_evento,
    visitas_por_evento

});