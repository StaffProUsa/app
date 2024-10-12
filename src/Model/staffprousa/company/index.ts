import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";


export default new SModel<Action, Reducer>({
    info: {
        component: "company"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "F. Creacion" },
        "estado": { type: "integer" },
        "descripcion": { type: "text", editable: true, label: "Name" },
        "observacion": { type: "text", editable: true, label: "Detail" },
    },
    image: {
        name: "company",
        api: "root",
    },
    Action,
    Reducer,
});