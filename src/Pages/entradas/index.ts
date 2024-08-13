import { SPage } from "servisofts-component";
import root from "./root";
import invite from "./invite";
import profile from "./profile";
import mesa from "./mesa";
import banner from "./banner";
export const Parent = {
    name: "entradas",
    path: `/entradas`,
}


export default SPage.combinePages(Parent.name, {
    "": root,
    ...mesa,
    invite,
    banner,
    profile
})
