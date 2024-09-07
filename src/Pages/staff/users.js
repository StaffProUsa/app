import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SList, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Container } from '../../Components';

export default class users extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.pk = SNavigation.getParam("pk");
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "staff",
            type: "getByKeyDetalle",
            key: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })

    }

    renderStaffUsuario(staff_usuario) {
        if (!staff_usuario) return
        if (staff_usuario.estado == 2) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Invitacion pendiente de confirmar", es: "Invitacion pendiente de confirmar" }} />
        if (!staff_usuario.key_usuario_aprueba) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Esperando aprobacion", es: "Esperando aprobacion" }} />
        if (!staff_usuario.key_usuario_atiende) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Sin jefe", es: "Sin jefe" }} />
        return <>
            <SText fontSize={12} color={STheme.color.success} language={{ en: "Registrado en el puesto", es: "Registrado en el puesto" }} />
        </>
    }

    item(obj) {
        return <SView col={"xs-12"} card padding={8}>
            <SView row flex>
                <SView width={30} height={30}>
                    <SImage src={SSocket.api.root + "usuario/" + obj.key_usuario} />
                </SView>
                <SView>
                    <SText flex>{obj.key_usuario}</SText>
                    {this.renderStaffUsuario(obj)}
                </SView>
            </SView>

        </SView>
    }
    render() {
        return <SPage>
            <Container>
                <SText bold fontSize={18}>{this.state?.data?.evento?.descripcion}</SText>
                <SHr />
                <SText fontSize={16}>{this.state?.data?.staff_tipo?.descripcion}</SText>
                <SText color={STheme.color.lightGray}>{this.state?.data?.descripcion}</SText>
                <SHr />
                <SText fontSize={10} color={STheme.color.lightGray}>{this.state?.data?.fecha_inicio} {this.state?.data?.fecha_fin}</SText>
                <SHr />
                <SList
                    buscador
                    data={this.state?.data?.staff_usuario ?? []}
                    render={this.item.bind(this)}
                />
            </Container>
        </SPage>
    }
}
