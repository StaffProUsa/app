import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import { SHr, SIcon, SImage, SNavigation, SPopup, SText, STheme, SUtil, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PBarraFooter from '../../Components/PBarraFooter';

class index extends DPA.list {
    static FOOTER = <>
        <PBarraFooter style={{
            position: "absolute",
            bottom: 0,
        }} url={'/company'} />
    </>
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
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new", user_data: { key_company: this.$params.key_company } });
    }
    $allowTable() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "table", user_data: { key_company: this.$params.key_company } });
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver", user_data: { key_company: this.$params.key_company } });
    }
    $filter(data) {
        return data.estado != 0
    }
    onNew() {
        SNavigation.navigate("/cliente/add", { key_company: this.$params.key_company });
    }

    // onNew() {
    //     SNavigation.navigate("/cliente/select", {
    //         onSelect: (direccion) => {
    //             Model.cliente.Action.registro({
    //                 data: {
    //                     key_company: this.$params.key_company,
    //                     ...direccion,
    //                     descripcion: direccion.direccion
    //                 },
    //                 key_usuario: Model.usuario.Action.getKey()
    //             })
    //             SNavigation.goBack();
    //         },
    //     })
    // }
    // $onSelect(data) {
    //     SNavigation.navigate("/cliente/select", {
    //         onSelect: (direccion) => {
    //             Model.cliente.Action.editar({
    //                 data: {
    //                     ...data,
    //                     ...direccion,
    //                     descripcion: direccion.direccion
    //                 }
    //             })
    //             SNavigation.goBack();
    //         },
    //         latitude: data.latitude,
    //         longitude: data.longitude,
    //         direccion: data.descripcion

    //     })
    //     return;
    // }

    $item(obj) {
        return <SView col={"xs-12"} padding={8} row style={{
            borderBottomWidth: 1,
            borderColor: STheme.color.card
        }}>
            <SView flex style={{ justifyContent: "center" }} onPress={this.$onSelect.bind(this, obj)}>
                <SText bold fontSize={16}>{obj.descripcion}</SText>
                <SHr h={4} />
                <SText color={STheme.color.gray} fontSize={12}>{SUtil.limitString(obj.observacion ?? "", 100)}</SText>
                {/* <SText color={STheme.color.lightGray} fontSize={8}>{obj.latitude},{obj.longitude}</SText> */}
            </SView>
            <SView width={30} height={30} onPress={() => {
                SPopup.confirm({
                    title: "Esta seguro que descea eliminar?",
                    message: "Eliminar",
                    onPress: () => {
                        Model.cliente.Action.editar({
                            data: {
                                ...obj,
                                estado: 0
                            }
                        })
                    }
                })

            }}>
                <SIcon name='Delete' />
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