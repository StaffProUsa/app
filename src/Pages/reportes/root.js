import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SIcon, SLoad, SNavigation, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component'
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos'
import Model from '../../Model'
import { SHr } from 'servisofts-component'

export default class root extends Component {

    state = {}
    componentDidMount() {
        new SThread(200, "adasd", false).start(() => {
            this.setState({ load: true })
        })
    }
    navegar() {

    }
    render() {
        if (!this.state.load) return <SLoad />
        const idemp = Model.usuario.Action.getUsuarioLog().idvendedor;
        return <SPage title="Reportes" >
            <SView col={"xs-12"} center >
                <SView col={"xs-11"}  >
                    <MenuPages path={"/reportes/"} permiso={"page"} >
                        <MenuButtom label={"Ventas por eventos"} url={"/reportes/ventas_por_evento"} icon={<SIcon name={"Excel"} />} />
                        <MenuButtom label={"Company"} url={"/reportes/reportCompany"} icon={<SIcon name={"Excel"} />} />
                        
                    </MenuPages>
                </SView>
            </SView>
        </SPage>
    }
}