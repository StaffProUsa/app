import { SPage } from "servisofts-component";
import Model from "../../../Model";
import root from "./root";
import hours from "./hours"
import usuarios_bloqueados from "./usuarios_bloqueados";


export default SPage.combinePages("profile", {
    "": root,
    hours,
    usuarios_bloqueados,
})
