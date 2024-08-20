import { SAction } from "servisofts-model";
import Model from "../..";
import SSocket from 'servisofts-socket'

export default class Action extends SAction {

    key_evento = ""
    getAll(extra?: any) {

        if (extra.key_evento) {
            if (extra.key_evento != this.key_evento) {
                super.CLEAR();
                this.key_evento = extra.key_evento
            }

        }
        return super.getAll({
            key_usuario: Model.usuario.Action.getKey(),
            ...extra
        });
    }

}   