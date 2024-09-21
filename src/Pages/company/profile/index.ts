import { SPage } from "servisofts-component";
import Model from "../../../Model";
import root from "./root";
// import invite from "./invite";

// export const Parent = {
//     name: "company",
//     path: `/company`,
//     model
// }
export default SPage.combinePages("profile", {
    "": root,
    // "invite": invite,
})
