import { SPage } from "servisofts-component";
import Model from "../../Model";
import root from "./root";

const model = Model.rol;
export const Parent = {
    name: "invitation",
    path: `/invitation`,
    model
}
export default SPage.combinePages(Parent.name, {
    "": root,
    "root": root,
})
