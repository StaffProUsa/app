import SSocket from "servisofts-socket";
import Model from "../Model";

export default class Roles {


    static companys: any = null
    static loading_companys = false
    static data: any = {}
    static async $getAllCompanyByUser({ key_usuario, force = false }) {
        if (Roles.companys && !force) return Roles.companys
        const resp: any = await SSocket.sendPromise({
            "component": "company",
            "type": "getAll",
            "estado": "cargando",
            "key_usuario": key_usuario,
            "ver_mias": true
        })
        Roles.companys = resp.data;
        return Roles.companys;
    }
    static async $getCompanyByUser({ key_company, key_usuario, force = false }) {
        const companys = await this.$getAllCompanyByUser({ key_usuario, force })
        return companys[key_company];
    }
    static async $getRolData({ key_rol }) {
        if (!key_rol) return;
        if (Roles.data[key_rol]) return Roles.data[key_rol];
        const resp: any = await SSocket.sendPromise({
            service: "roles_permisos",
            component: "usuarioPage",
            type: "getAllRol",
            key_rol: key_rol
        })
        Roles.data[key_rol] = resp.data;
        return Roles.data[key_rol];

    }

    static async $getPermiso({ key_usuario, key_company, url, permiso }) {
        const company = await Roles.$getCompanyByUser({ key_company, key_usuario });
        const data = await Roles.$getRolData({ key_rol: company.key_rol });
        const page = data[url];
        if (page) {
            const _permiso = page.permisos[permiso];
            if (!_permiso) throw "Sin permiso"
            return _permiso;
        }
        throw "Sin permiso"
    }


    static getPermiso({ key_usuario, key_company, url, permiso, loading = "cargando" }) {

        if (!Roles.companys) {
            Roles.$getCompanyByUser({ key_company, key_usuario }).then(e => {
                // Aqui avisar cuando se carga;
                Model.usuarioPage.Action._dispatch({
                    component: "usuarioPage",
                    type: "reload",
                })
            }).catch(e => {
                console.error(e);
            })
            return loading
        }
        const company = Roles.companys[key_company]
        if (!company || !company.key_rol) return "";
        const data = Roles.data[company.key_rol];

        if (!data) {
            Roles.$getRolData({ key_rol: company.key_rol }).then(e => {
                Model.usuarioPage.Action._dispatch({
                    component: "usuarioPage",
                    type: "reload",
                    estado: "exito",
                })
                // Aqui avisar cuando se carga;
            }).catch(e => {
                console.error(e);
            })
            return loading;
        }
        // const data = await Roles.$getRolData(company.key_rol);
        const page = data[url];
        if (page) {
            const _permiso = page.permisos[permiso];
            if (!_permiso) return "";
            return _permiso;
        }
        return ""
    }


}