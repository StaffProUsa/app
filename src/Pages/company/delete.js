import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../Model';

class index extends DPA.delete {
    constructor(props) {
        super(props, { Parent: Parent, });
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete", user_data: { key_company: this.pk } })
    }
    $onDelete() {
        this.data.estado = 0;
        Parent.model.Action.editar({ data: this.data }).then((resp) => {
            SNavigation.goBack();
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }

    $getData() {

        return Parent.model.Action.getByKey(this.pk);
    }
}
export default connect(index);