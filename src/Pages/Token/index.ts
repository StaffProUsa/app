import { SPage } from "servisofts-component";
import Model from "../../Model";
import root from "./root";
import exito from "./exito";
const model = Model.rol;
export const Parent = {
    name: "token",
    path: `/token`,
    model
}
export default SPage.combinePages(Parent.name, {
    "": root,
    exito
})
