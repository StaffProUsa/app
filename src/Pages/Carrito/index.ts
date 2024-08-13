import { SPage } from "servisofts-component";
import root from "./root";
import Detalle from "./Detalle";

import Confirmar_admin from "./Confirmar_admin";
export default SPage.combinePages("carrito", {
    "": Detalle,
    Confirmar_admin

})