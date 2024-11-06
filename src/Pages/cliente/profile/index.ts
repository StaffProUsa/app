import { SPage } from "servisofts-component";
import Model from "../../../Model";
import root from "./root";
import hours from "./hours"

export default SPage.combinePages("profile", {
    "": root,
    hours,
})
