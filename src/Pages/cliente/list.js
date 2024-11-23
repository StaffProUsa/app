import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import { SHr, SIcon, SImage, SNavigation, SPopup, SText, STheme, SUtil, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PBarraFooter from '../../Components/PBarraFooter';
import ImageProfile from '../../Components/ImageProfile';

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
            title: "List client",
            excludes: ["key", "fecha_on", "key_usuario", "key_company", "estado"],
            params: ["key_company"],
            pageParams: {
                backAlternative: (opt) => {
                    SNavigation.replace("/company/profile", { pk: opt.params.key_company })
                    console.log(opt)
                }
            },
            onRefresh: (resolve) => {
                Parent.model.Action.CLEAR();
                if (resolve) resolve();

            }
        });
    }

    componentDidMount() {
        Parent.model.Action.CLEAR();
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
        return data.estado != 0 && data.key_company == this.$params.key_company
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
        let permisoDelete = Model.usuarioPage.Action.getPermiso({ url: "/cliente", permiso: "delete", user_data: { key_company: this.$params.key_company } });
        return <SView col={"xs-12"} padding={8} row style={{
            borderBottomWidth: 1,
            borderColor: STheme.color.card
        }}>
            <ImageProfile
                width={40}
                src={SSocket.api.root + "cliente/" + obj.key}
            />

            <SView width={8} />
            <SView flex style={{ justifyContent: "center" }} onPress={this.$onSelect.bind(this, obj)} >
                <SView row>
                    <ImageProfile
                        width={20}
                        src={SSocket.api.root + "company/" + this.$params.key_company}
                    />
                    <SView width={4}/>
                    <SText bold fontSize={16}>{obj.descripcion}</SText>
                </SView>
                <SText color={STheme.color.lightGray} fontSize={12}>{SUtil.limitString(obj.observacion ?? "", 100).trim()}</SText>
            </SView>
            {!permisoDelete ? null : <SView width={30} height={30} onPress={() => {
                SPopup.confirm({
                    title: "Esta seguro que desea eliminar?",
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
            </SView>}
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