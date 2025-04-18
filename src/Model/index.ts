import { SModel } from "servisofts-model";
import Contabilidad from "servisofts-rn-contabilidad";
import Usuario from "servisofts-rn-usuario";
import Roles_permisos from "servisofts-rn-roles_permisos";
import Chat from 'servisofts-rn-chat'
import Geolocation from "servisofts-rn-geolocation"
import notification from "./notification";
import staffprousa from "./staffprousa";
import { STheme } from "servisofts-component";
import Roles from "../Roles";

const Model = {
    ...Usuario.Model,
    ...Roles_permisos.Model,
    ...Contabilidad.Model,
    ...Chat.Model,
    ...Geolocation.Model,
    ...notification,
    ...staffprousa
}

Usuario.init({
    cabecera: "usuario_app",
    Columns: {
        "key": { type: "text", pk: true },
        "Nombres": { type: "text", label: "Name", notNull: true, editable: true },
        "Apellidos": { type: "text", label: "Last Name", notNull: true, editable: true },
        "fecha_nacimiento": { type: "date", label: "Date of Birth", notNull: true, editable: true },
        "estado_civil": { type: "text", label: "Marital Status",  editable: true },
        "employee_number": { type: "text", label: "Employee Number",  editable: true },
        "salario_hora": { type: "text", label: "Salary",  editable: true },
        "Telefono": { type: "text", label: "Phone Number", editable: true, notNull: true },
        // "CI": { type: "text", notNull: true, editable: true },
        "Correo": { type: "text", label: "Email", notNull: true, editable: true },
        "direccion": { type: "text", label: "Home Address", editable: true , notNull: true,},
        "nivel_ingles": { type: "text", label: "English level", editable: true ,notNull: true},
        "otros_idiomas": { type: "text", label: "Legal Status", editable: true,notNull: true },
        "papeles": { type: "text", label: "Are you legally authorized to work in the United State?", editable: true },
        "Password": { type: "text",  editable: true },
    },
});

Roles_permisos.init({
    modelusuario: Model.usuario,
    getPermisoOverride: ({ permiso, url, key_empresa, loading, user_data }) => {
        const key_usuario = Model.usuario.Action.getKey();
        if (!key_usuario) return "";
        if (!user_data?.key_company && !key_empresa) return "";
        return Roles.getPermiso({
            permiso: permiso,
            url: url,
            key_company: key_empresa ?? user_data?.key_company,
            key_usuario: key_usuario,
            loading: loading
        })
    }
});



export default {
    ...Model,
    ...SModel.declare(Model)
}