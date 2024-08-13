import { SPage } from "servisofts-component";
import Model from "../../Model";
import list from "./list";
import all from "./all";
import table from "./table";
import _new from "./new";
import profile from "./profile";
import edit from "./edit";
import edit_datos from "./edit_datos";
import _delete from "./delete";
import restore from "./restore";
import eliminados from "./eliminados";
import perfil from "./perfil";
import eventos from "./eventos";
import entradas from "./entradas";

const model = Model.usuario;

export const Parent = {
    name: "usuario",
    path: `/usuario`,
    model
}
export default SPage.combinePages(Parent.name, {
    "": list,
    "list": list,
    "all": all,
    "eliminados": eliminados,
    "table": table,
    "new": _new,
    "profile": profile,
    "edit": edit,
    "profile/edit_datos": edit_datos,
    "delete": _delete,
    "restore": restore,
    "perfil": perfil,
    "eventos": eventos,
    "entradas": entradas,
})
