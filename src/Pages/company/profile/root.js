import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SIcon, SImage, SLanguage, SList, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos';
import Roles from '../../../Roles';
import PBarraFooter from '../../../Components/PBarraFooter';

class index extends DPA.profile {
    static FOOTER = <>
        <PBarraFooter style={{
            position: "absolute",
            bottom: 0,
        }} url={'/company'} />
    </>

    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "key_usuario", "key_servicio", "estado", "fecha_on",]
        });
    }
    state = {
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        // Roles.$getPermiso({
        //     url: Parent.path, permiso: "ver", key_company: this.pk, key_usuario: Model.usuario.Action.getKey()
        // }).then(e => {
        //     this.setState({ permiso_ver: "si" })
        // }).catch(e => {
        //     this.setState({ permiso_ver: "" })
        // })
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    $allowEdit() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.pk } })
    }
    $allowDelete() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete", user_data: { key_company: this.pk } })
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver", user_data: { key_company: this.pk } })
    }

    $getData() {
        this.usuarios = Model.usuario.Action.getAll();
        return Parent.model.Action.getByKey(this.pk);
    }

    $menu() {
        var items = super.$menu();
        if (Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "share", user_data: { key_company: this.pk } })) {
            items.push({
                children: <SView col={"xs-12"} center padding={10} row
                    onPress={() => {
                        SNavigation.navigate("/company/invite", { key_company: this.pk })
                    }}>
                    <SIcon name={"Compartir"} height={15} width={15} fill={STheme.color.text} />
                    <SView width={10} />
                    <SText>Share</SText>
                </SView>,
            })
        }

        return items;
    }

    $footer() {

        return <SView col={"xs-12"}>
            <SHr />
            <MenuPages path='/company/' permiso='ver__' params={{ pk: this.pk }} blackList={[
                "/company/profile/staff_tipo",
                "/company/profile/users",
                "/company/profile/report",
            ]}>
                <MenuButtom label={SLanguage.select({ en: "Client", es: "Cliente" })} url='/cliente' params={{ key_company: this.pk }} icon={<SIcon name='ubicacionesA' />} />
                <MenuButtom label={SLanguage.select({ en: "Type Staff", es: "Staff Tipo" })} url='/company/profile/staff_tipo' params={{ pk: this.pk }} icon={<SIcon name='staffTipoA' />} />
                <MenuButtom label={SLanguage.select({ en: "Users", es: "Usuarios" })} url='/company/profile/users' params={{ pk: this.pk }} icon={<SIcon name='usuariosA' />} />
                <MenuButtom label={SLanguage.select({ en: "Enabled Users", es:"Usuarios Habilitados"})} url='/company/profile/users' params={{pk:this.pk, filter:"enabled"}} icon={<SIcon name='usuariosA'/>}/>
                <MenuButtom label={SLanguage.select({ en: "Disabled Users", es:"Usuarios Deshabilitados"})} url='/company/profile/users' params={{pk:this.pk,filter:"disabled"}} icon={<SIcon name='usuariosA'/>}/>
                <MenuButtom label={SLanguage.select({ en: "New Users", es:"Usuarios Nuevos"})} url='/company/profile/users' params={{pk:this.pk,filter:"nuevo"}} icon={<SIcon name='usuariosA'/>}/>
                <SHr />
                {/* <MenuButtom label={SLanguage.select({ en: "Report", es: "Reporte" })} url='/company/profile/report' params={{ pk: this.pk }} icon={<SIcon name='Excel' />} /> */}



                {/* para evento */}
                <MenuButtom label={SLanguage.select({ en: "timeSheets", es: "timeSheets" })} url='/company/timeSheets' params={{ key_company: this.pk }} icon={<SIcon name='itimesheet' fill={STheme.color.text} />} />
                <MenuButtom label={SLanguage.select({ en: "dashBoard", es: "dashBoard" })}
                    // url='/company/dashboard' params={{ key_company: this.pk }}
                    onPress={() => {
                        SNavigation.navigation.navigate({ name: "/company/dashboard", params: { key_company: this.pk }, key: Math.random() })
                    }}
                    icon={<SIcon name='Excel' fill={STheme.color.text} />} />

                {/* <MenuButtom label={SLanguage.select({ en: "time_sheets", es: "time_sheets" })} url='/company/profile/time_sheets' params={{ key_company: this.pk, key_cliente: this.pk }} icon={<SIcon name='Menu' />} /> */}
                {/* <MenuButtom label={SLanguage.select({ en: "time_sheets", es: "time_sheets" })} url='/company/profile/time_sheets' params={{ key_company: this.pk, key_cliente: this.pk }} icon={<SIcon name='Menu' />} /> */}

                {/* <MenuButtom label='Eventos' url='/company/eventos' params={{ key_company: this.pk }} icon={<SIcon name='eventA' />} /> */}

            </MenuPages>
        </SView>
    }

}
export default connect(index);