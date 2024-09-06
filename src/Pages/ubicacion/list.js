import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import { SNavigation } from 'servisofts-component';

class index extends DPA.list {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "fecha_on", "key_usuario", "key_company", "estado"],
            params: ["key_company"],
            onRefresh: (resolve) => {
                Parent.model.Action.CLEAR();
                if (resolve) resolve();

            }
        });
    }
    $allowNew() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" });
    }
    $allowTable() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "table" });
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" });
    }
    $filter(data) {
        return data.estado != 0
    }

    $onSelect(data) {
        SNavigation.navigate("/ubicacion/select", {
            onSelect: (direccion) => {
                Model.ubicacion.Action.editar({
                    data: {
                        ...data,
                        ...direccion,
                        descripcion: direccion.direccion
                    }
                })
                SNavigation.goBack();
            },
            latitude: data.latitude,
            longitude: data.longitude,
            direccion: data.descripcion

        })
        return;
    }
    $order() {
        return [{ key: "descripcion", order: "asc", peso: 1 }]
    }
    $getData() {
        return Parent.model.Action.getAll({ key_company: this.$params.key_company });
    }
}
export default connect(index);