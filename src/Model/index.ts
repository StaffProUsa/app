import { SModel } from "servisofts-model";
import Contabilidad from "servisofts-rn-contabilidad";
import Usuario from "servisofts-rn-usuario";
import Roles_permisos from "servisofts-rn-roles_permisos";
import Chat from 'servisofts-rn-chat'
import notification from "./notification";
import staffprousa from "./staffprousa";
import { STheme } from "servisofts-component";
import Roles from "../Roles";

const Model = {
    ...Usuario.Model,
    ...Roles_permisos.Model,
    ...Contabilidad.Model,
    ...Chat.Model,
    ...notification,
    ...staffprousa
}

Usuario.init({
    cabecera: "usuario_app",
    Columns: {
        "key": { type: "text", pk: true },
        "Nombres": { type: "text", notNull: true, editable: true },
        "Apellidos": { type: "text", notNull: true, editable: true },
        "CI": { type: "text", notNull: true, editable: true },
        "Correo": { type: "text", notNull: true, editable: true },
        "papeles": { type: "text", editable: true },
        "nivel_ingles": { type: "text", editable: true },
        "Telefono": { type: "text", editable: true },
        "Password": { type: "text", notNull: true, editable: true },
    },
});

Roles_permisos.init({
    modelusuario: Model.usuario,
    getPermisoOverride: ({ permiso, url, key_empresa, loading, user_data }) => {
        const key_usuario = Model.usuario.Action.getKey();
        if (!key_usuario) return "";
        if (!user_data) return "";
        if (!user_data.key_company) return "";
        return Roles.getPermiso({
            permiso: permiso,
            url: url,
            key_company: user_data.key_company,
            key_usuario: key_usuario,
            loading: loading
        })
    }
});



export default {
    ...Model,
    ...SModel.declare(Model)
}