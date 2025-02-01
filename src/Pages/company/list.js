import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import { SIcon, SImage, SNavigation, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PBarraFooter from '../../Components/PBarraFooter';
import Roles from '../../Roles';
import SRT from '../../SRT';

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
            excludes: ["key", "fecha_on", "key_usuario", "estado"],
            // params: ["key_evento"],
            onRefresh: (resolve) => {
                Parent.model.Action.CLEAR();
                if (resolve) resolve();

            }
        });
        this.state = {
            my_companys: {}
        }
    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "usuario_company",
            type: "getCompanys",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            const companys = {}
            Object.values(e.data).map(a => {
                companys[a.key_company] = a;
            })
            this.setState({ my_companys: companys })
        }).catch(e => {

        })

        this.SRTEvent = SRT.subscribe((evt) => {
            if (evt.component == "usuario_company" && evt.type == "editar") {
                this.componentDidMount();
            }
        })
    }
    componentWillUnmount() {
        SRT.unsubscribe(this.SRTEvent)
    }

    $allowNew() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new", });
    }
    $allowTable() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "table" });
    }
    $allowAccess() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver_todas" });
        return true;
    }
    $filter(data) {
        // const todas = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver_todas", loading: "cargando" });
        // if (todas == "cargando") return false;
        // if (todas) return data.estado != 0
        return data.estado != 0
    }


    // $onSelect(data) {
    //     SNavigation.navigate("/company/profile", { pk: data.pk })
    // }
    $item(obj) {
        const mc = this.state.my_companys[obj.key];
        return <SView col={"xs-12"} padding={8} onPress={this.$onSelect.bind(this, obj)} style={{
            borderBottomWidth: 1,
            borderColor: STheme.color.card
        }}>
            <SView row col={"xs-12"}>
                <SView width={40} height={40} style={{
                    borderRadius: 4,
                    overflow: 'hidden',
                }}>
                    <SImage src={SSocket.api.root + "company/" + obj.key} />
                </SView>
                <SView width={8} />
                <SView flex>
                    <SText bold fontSize={16}>{obj.descripcion}</SText>
                    <SText fontSize={15} color={STheme.color.gray}>{obj.observacion}</SText>
                </SView>
            </SView>
            <SView col={"xs-12"} row center>
                <SView flex />
                {!mc ? null : <SView row center onPress={() => {
                    console.log(mc);
                    SNavigation.navigate("/company/editEmployee", { key_employe: mc.key })
                }} >
                    <SText fontSize={8} color={STheme.color.gray} >Employee #:</SText>
                    <SView width={8} />
                    <SText fontSize={10} bold>{mc?.employee_number ?? ""}</SText>
                    <SView width={16} height={16}>
                        <SIcon name='Edit' />
                    </SView>
                </SView>}
            </SView>
        </SView>
    }
    $order() {
        return [{ key: "descripcion", order: "asc", peso: 1 }]
    }
    $getData() {
        const todas = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver_todas", loading: "cargando" });
        if (todas == "cargando") return null;
        return Parent.model.Action.getAll({ ver_mias: !todas });
    }

    // $footer() {
    //     return <PBarraFooter style={{
    //         position: "absolute",
    //         bottom: 0,
    //     }} url={'/company'} />
    // }
}
export default connect(index);