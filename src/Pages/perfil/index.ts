import { SPage } from 'servisofts-component';

import root from './root';
import editar from './editar';
import changepass from './changepass';
import eliminar from './eliminar';
import staff_tipo from './staff_tipo';
import staff_tipo_adm from './staff_tipo_adm';
import staff_tipo_detail from './staff_tipo_detail';
export const Parent = {
    name: "perfil",
    path: "/perfil"
}
export default SPage.combinePages(Parent.name, {
    "": root,
    "editar":editar,
    changepass,
    eliminar,
    staff_tipo,
    staff_tipo_adm,
    staff_tipo_detail

});