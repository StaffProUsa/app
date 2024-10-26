import { SPage } from "servisofts-component";
import Model from "../../Model";
import list from "./list";
import table from "./table";
import _new from "./new";
import profile from "./profile/index";
import edit from "./edit";
import _delete from "./delete";
import roles from "./roles";
import event from "./event";
import invite from "./invite";
import users from "./users";
const model = Model.company;
export const Parent = {
    name: "company",
    path: `/company`,
    model
}
export default SPage.combinePages(Parent.name, {
    "": list,
    "list": list,
    "table": table,
    "new": _new,
    ...profile,
    event,
    "edit": edit,
    "delete": _delete,
    "invite": invite,
    ...roles,
    ...users
})
