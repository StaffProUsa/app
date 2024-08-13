import { SPage } from "servisofts-component";
import root from "./root.js";
import profile from "./profile.js";
export const Parent = {
    name: "mesa",
    path: `/entradas/mesa`,
}


export default SPage.combinePages(Parent.name, {
    "": root,
    profile
})
