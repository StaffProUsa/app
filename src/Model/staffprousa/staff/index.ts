import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";


export default new SModel<Action, Reducer>({
    info: {
        component: "staff"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "F. Creacion" },
        "estado": { type: "integer" },
        "descripcion": { type: "text", editable: true },
        "observacion": { type: "text", editable: true },
        "key_evento": { type: "text", fk: "evento" },
        "key_staff_tipo": { type: "text", fk: "staff_tipo" },
        "fecha_inicio": { type: "timestamp", label: "F. Inicio", editable: true },
        "fecha_fin": { type: "timestamp", label: "F. Fin", editable: true },
        "cantidad": { type: "integer", label: "Cantidad", editable: true },
    },
    image: {
        name: "staff",
        api: "root",
    },
    Action,
    Reducer,
});