import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../Model';

class index extends DPA.edit {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: []
        });
    }
    $allowAccess() {
        this.data = this.$getData();
        if (!this.data) return "cargando"
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.data.key_company } })
    }
    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }

    $onSubmit(data) {
        Parent.model.Action.editar({
            ...this.data,
            ...data
        }).then((resp) => {
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }
}

export default connect(index);