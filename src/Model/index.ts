import { SModel } from "servisofts-model";
import Contabilidad from "servisofts-rn-contabilidad";
import Usuario from "servisofts-rn-usuario";
import Roles_permisos from "servisofts-rn-roles_permisos";
import Chat from 'servisofts-rn-chat'
import notification from "./notification";
import { STheme } from "servisofts-component";

const Model = {
    ...Usuario.Model,
    ...Roles_permisos.Model,
    ...Contabilidad.Model,
    ...Chat.Model,
    ...notification
}

Usuario.init({
    cabecera: "usuario_app",
    Columns: {
        "key": { type: "text", pk: true },
        "Nombres": { type: "text", notNull: true, editable: true },
        "Apellidos": { type: "text", notNull: true, editable: true },
        "CI": { type: "text", notNull: true, editable: true },
        "Correo": { type: "text", notNull: true, editable: true },
        "Telefono": { type: "text", editable: true },
        "Password": { type: "text", notNull: true, editable: true },
    },
});
Roles_permisos.init({
    modelusuario: Model.usuario,
});



export default {
    ...Model,
    ...SModel.declare(Model)
}