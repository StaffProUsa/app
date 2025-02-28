import { SPage } from "servisofts-component";
import Model from "../../../Model";
import root from "./root";
import staff_tipo from "./staff_tipo";
import report from "./report";
import users from "./users"
import users_ from "./users_";
// import invite from "./invite";

// export const Parent = {
//     name: "company",
//     path: `/company`,
//     model
// }
export default SPage.combinePages("profile", {
    "": root,
    staff_tipo,
    report,
    "users":users,
    // "users_":users,
    // users_
    // "invite": invite,
})
