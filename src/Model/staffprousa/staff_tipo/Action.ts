import { SAction } from "servisofts-model";
import Model from "../..";
import SSocket from 'servisofts-socket'

export default class Action extends SAction {

    getAll(_extra?: { key_company?: string }) {
        let extra = {} as typeof _extra
        if (_extra) extra = _extra;
        // if (extra?.key_company) {
        const reducer = this._getReducer();
        if (reducer.key_company != extra?.key_company) {
            reducer.key_company = extra?.key_company;
            reducer.data = null;
        }
        // }

        return super.getAll({
            key_usuario: Model.usuario.Action.getKey(),
            ...extra
        });
    }

}   