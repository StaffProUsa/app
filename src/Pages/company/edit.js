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
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.pk } })
    }

    $inputs() {
        const inp = super.$inputs();

        inp["descripcion"].required = true;
        // inp["email"].required = true;
        // inp["contacto"].required = true;
        // inp["telefono"].required = true;


        inp["email"].type = "email";
        inp["telefono"].type = "phone";
        inp["contacto"].col = "xs-7"
        inp["telefono"].col = "xs-4.5"
        return inp;
    }

    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }

    $onSubmit(data) {
        Parent.model.Action.editar({
            data: {
                ...this.data,
                ...data
            },
            key_usuario: Model.usuario.Action.getKey()
        }).then((resp) => {
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }
}

export default connect(index);