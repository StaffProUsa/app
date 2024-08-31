import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";


export default new SModel<Action, Reducer>({
    info: {
        component: "staff_tipo"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "F. Creacion" },
        "key_company": { type: "text", fk: "company" },
        "estado": { type: "integer" },
        "descripcion": { type: "text", editable:true },
        "observacion": { type: "text", },
    },
    image: {
        name: "staff_tipo",
        api: "root",
    },
    Action,
    Reducer,
});