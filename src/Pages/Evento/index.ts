import { SPage } from "servisofts-component";
import Model from "../../Model";
import Perfil from "./Perfil";
import registro from "./Registro";
// const model = Model.evento;

export const Parent = {
    name: "evento",
    path: `/evento`,
}
export default SPage.combinePages(Parent.name, {
    "": Perfil,
    registro
})
