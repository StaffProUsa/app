import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import { SForm, SHr, SIcon, SInput, SList, SLoad, SText, STheme, SView } from 'servisofts-component';
import Model from '../../Model';
import { EditarUsuarioRol } from 'servisofts-rn-roles_permisos';
// import DatosDocumentos from './Components/DatosDocumentos';

class index extends DPA.profile {
    state = {}

    constructor(props) {
        super(props, {
            Parent: Parent, excludes: ["key", "Password"],
            itemType: "1"
        });
    }

    $allowEdit() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" })
    }

    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" })
    }
    $allowDelete() {
        if (this.data?.estado == 0) return;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" })
    }
    $allowRestore() {
        return true;
        if (this.data?.estado != 0) return false;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "restore" })
    }
    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }

    getCompras() {
        if (!this.state.compras) return <SView><SText center>Compras</SText><SLoad /></SView>

    }
    getInvitaciones() {
        if (!this.state.invitaciones) return <SView><SText center>Invitaciones</SText><SLoad /></SView>
    }
    getAsisntencias() {
        if (!this.state.asistencias) return <SView><SText center>Asisntencias</SText><SLoad /></SView>
    }

    $footer() {

        return <SView col={"xs-12"}>
            {/* <DatosDocumentos key_usuario={this.pk} /> */}
            {/* <SHr height={16} /> */}
            {/* <DatosDocumentosEditar key_usuario={this.pk} /> */}
            <SHr height={30} />
            {/* <SView width={180} height={40} row style={{
                backgroundColor: STheme.color.card,
                borderRadius: 8,
                borderWidth: 1,
                overflow: "hidden",
                borderColor: STheme.color.primary
            }} onPress={() => {
                this.props.navigation.navigate("/usuario/eventos", { pk: this.pk })
            }} >
                <SView width={50} height backgroundColor={STheme.color.primary} center>
                    <SIcon name={'eventos'} fill={STheme.color.secondary} height={25} width={25} />
                </SView>
                <SView flex height center>
                    <SText center bold fontSize={16}>EVENTOS</SText>
                </SView>
            </SView>
            <SHr height={20} /> */}

            {/* <SText style={{ textDecorationLine: "underline" }} onPress={() => {
                this.props.navigation.navigate("/usuario/eventos", { pk: this.pk })
            }} >EVENTOS</SText> */}

            {/* <EditarUsuarioRolEmpresa key_usuario={this.pk} key_empresa={Model.empresa.Action.getSelect()?.key} url={"/usuario"} permiso={"edit_rol"} /> */}
            {/* <SHr height={50} /> */}
            <EditarUsuarioRol key_usuario={this.pk} url={"/usuario"} permiso={"edit_rol"}  />


        </SView>

    }
}
export default connect(index);