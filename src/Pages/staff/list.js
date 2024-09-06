import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';

class index extends DPA.list {
    static INSTANCE;
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "fecha_on", "key_usuario", "estado"],
            params: ["key_evento"],
            onRefresh: (resolve) => {
                Parent.model.Action.CLEAR();
                if (resolve) resolve();

            }
        });
        index.INSTANCE = this;
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

    $order() {
        return [{ key: "descripcion", order: "asc", peso: 1 }]
    }
    $getData() {
        return Parent.model.Action.getAll({ key_evento: this.$params.key_evento });
    }

}
export default connect(index);