import { SPage } from "servisofts-component";
import root from "./root";

import pendiente from "./_state/pendiente";
import pagado from "./_state/pagado";
import timeout_reserva from "./_state/timeout_reserva";
import entradas from "./entradas";
import invite from "./invite";
export const venta_states = {
    pendiente,
    pagado,
    timeout_reserva
}


export const Parent = {
    name: "venta",
    path: `/venta`,
}


export default SPage.combinePages(Parent.name, {
    "": root,
    entradas,
    invite
})
