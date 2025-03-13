import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";


export default new SModel<Action, Reducer>({
    info: {
        component: "cliente"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "key_company": { type: "text", fk: "company" },
        "fecha_on": { type: "timestamp", label: "F. Creacion" },
        "estado": { type: "integer" },
        "descripcion": { type: "text", editable: true },
        "observacion": { type: "text", editable: true },
        "latitude": { type: "double", editable: true },
        "longitude": { type: "double", editable: true },
        "papeles": { type: "text", editable: true },
    },
    image: {
        name: "cliente",
        api: "root",
    },
    Action,
    Reducer,
});