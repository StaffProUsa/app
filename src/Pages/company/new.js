import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SForm, SNavigation, SPopup, SThread } from 'servisofts-component';
import Model from '../../Model';

class index extends DPA.new {
    constructor(props) {
        super(props, {
            Parent: Parent,
            params: ["onSelect?"],
            excludes: ["key", "fecha_on", "key_usuario", "estado", "key_servicio"]
        });
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" })
    }

    $inputs() {
        const inp = super.$inputs();
        return inp;
    }
    $onSubmit(data) {
        //data.key_empresa = Model.empresa.Action.getSelect()?.key;
        Parent.model.Action.registro({ data, key_usuario: Model.usuario.Action.getKey() }).then((resp) => {
            this.$submitFile(resp.data.key);
            SNavigation.replace("/company/profile", { pk: resp.data.key })
            new SThread(1000, "sadasd", false).start(() => {
                SNavigation.navigate("/company/profile/staff_tipo", { pk: resp.data.key })
            })
            // SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }
}

export default connect(index);