import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SForm, SNavigation, SPopup } from 'servisofts-component';
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
        if (inp["key_staff_tipo"]) {
            inp["key_staff_tipo"].onPress = () => {
                SNavigation.navigate("/staff_tipo", {
                    onSelect: (staff_tipo) => {
                        const form = this.form 
                        form.setValues({
                            key_staff_tipo: staff_tipo.key
                        })
                        // inp["key_staff_tipo"].value = staff_tipo.key 
                    }
                })
            }
        }
        inp["fecha_inicio"].type = "date"
        inp["fecha_fin"].type = "date"
        return inp;
    }
    $onSubmit(data) {
        //data.key_empresa = Model.empresa.Action.getSelect()?.key;
        Parent.model.Action.registro({ data, key_usuario: Model.usuario.Action.getKey() }).then((resp) => {
            this.$submitFile(resp.data.key);
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }
}

export default connect(index);