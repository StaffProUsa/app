import { SPage } from "servisofts-component";
import Model from "../../Model";
import list from "./list";
import table from "./table";
import _new from "./new";
import profile from "./profile/index";
import edit from "./edit";
import edit_employee from "./edit_employee";
import _delete from "./delete";
import roles from "./roles";
import event from "./event";
import detalle_asistencia from "./detalle_asistencia";
import invite from "./invite";
import dashboard from "./dashboard"
import timeSheets from "./timeSheets";
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
    "detalleAsistencia": detalle_asistencia,
    "edit": edit,
    "editEmployee": edit_employee,
    "delete": _delete,
    "invite": invite,
    dashboard,
    timeSheets,
    ...roles,
})
