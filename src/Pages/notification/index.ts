import { SPage } from 'servisofts-component';

import Model from '../../Model';

import root from './root';
import send from "./send"
import admin from './admin';
import list from './list';
import reporte_envios from './reporte_envios';
import _default from './default';
import task from './task';

const model = Model.notification;

export const Parent = {
    name: "notification",
    path: "/notification",
    model
}
export default SPage.combinePages(Parent.name, {
    // "": root,
    "": list,
    admin,
    reporte_envios,
    "list": list,
    "send": send,
    ...task,
    ..._default
    

});