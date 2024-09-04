import { SPage } from "servisofts-component";
import Model from "../../Model";
import list from "./list";
import table from "./table";
import _new from "./new";
import profile from "./profile/index";
import edit from "./edit";
import _delete from "./delete";
import roles from "./roles";
import eventos from "./eventos";
import event from "./event";
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
    eventos,
    event,
    "edit": edit,
    "delete": _delete,
    ...roles
})
