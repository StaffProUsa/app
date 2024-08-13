import { SPage } from 'servisofts-component';

import root from './root';
import editar from './editar';
import changepass from './changepass';
import eliminar from './eliminar';
export const Parent = {
    name: "perfil",
    path: "/perfil"
}
export default SPage.combinePages(Parent.name, {
    "": root,
    "editar":editar,
    changepass,
    eliminar

});