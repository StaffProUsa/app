import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SIcon, SLoad, SNavigation, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component'
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos'
import Model from '../../Model'
import { SHr } from 'servisofts-component'
import CameraComponent from '../../Components/CameraComponent/'

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

        return <SPage title="Analiza el ticket"  disableScroll>
            {/* <SText>Escanea el qr de la entrada</SText> */}
            {/* <SHr /> */}
            <SView col={"xs-12"} height>
                <CameraComponent />
            </SView>
        </SPage>
    }
}