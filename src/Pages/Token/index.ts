import { SPage } from "servisofts-component";
import Model from "../../Model";
import root from "./root";
import intro2 from "./intro2";
import intro3 from "./intro3";

const model = Model.rol;
export const Parent = {
    name: "intro",
    path: `/intro`,
    model
}
export default SPage.combinePages(Parent.name, {
    "": root,
    "root": root,
    "dos": intro2,
    "tres": intro3,
})
