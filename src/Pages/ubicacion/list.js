import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import { SHr, SImage, SNavigation, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';

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

    onNew() {
        SNavigation.navigate("/ubicacion/select", {
            onSelect: (direccion) => {
                Model.ubicacion.Action.registro({
                    data: {
                        key_company: this.$params.key_company,
                        ...direccion,
                        descripcion: direccion.direccion
                    },
                    key_usuario: Model.usuario.Action.getKey()
                })
                SNavigation.goBack();
            },
        })
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

    $item(obj) {
        return <SView col={"xs-12"} padding={8} row onPress={this.$onSelect.bind(this, obj)} style={{
            borderBottomWidth: 1,
            borderColor: STheme.color.card
        }}>
            <SView flex style={{ justifyContent: "center" }}>
                <SText bold fontSize={16}>{obj.descripcion}</SText>
                <SHr h={4} />
                <SText color={STheme.color.lightGray} fontSize={8}>{obj.latitude},{obj.longitude}</SText>
            </SView>
        </SView>
    }

    $order() {
        return [{ key: "descripcion", order: "asc", peso: 1 }]
    }
    $getData() {
        return Parent.model.Action.getAll({ key_company: this.$params.key_company });
    }
}
export default connect(index);