import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "notification_task",
        service: "notification",
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de registro" },
        "estado": { type: "integer" },

        "key_servicio": { type: "text", editable: true, label: "Servicio" },
        "fecha_send": { type: "date", editable: true, label: "fecha envio", notNull: true },
        "notification": { type: "json", editable: true },
    },
    Action,
    Reducer,
});