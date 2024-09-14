import { SAction } from "servisofts-model";
import Model from "../..";
import SSocket from 'servisofts-socket'

export default class Action extends SAction {

    getAll(extra?: {}) {
        const todas = Model.usuarioPage.Action.getPermiso({ url: "/company", permiso: "ver_todas", loading: "cargando", key_empresa: "" });
        if (todas == "cargando") return null;
        // return Parent.model.Action.getByKey(this.pk, { ver_mias: !todas });
        return super.getAll({
            key_usuario: Model.usuario.Action.getKey(),
            ver_mias: !todas,
            ...extra
        });
    }

}   