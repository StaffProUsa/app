import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SImage, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';

export default class UsuarioItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.getUsuario(this.props.key_usuario)
    }
    getUsuario = (key) => {
        if (!key) return;
        Model.usuario.Action.getByKeyAsync({ key: key }).then(e => {
            this.setState({ usuario: e.data })
        }).catch(e => {
            console.error(e)

        })
    }
    renderUsuario = ({ label, key_usuario, fecha }) => {
        if (!key_usuario) return null;
        const usuario = this.state.usuario ?? {}
        return <SView col={"xs-12"} row card height={50} >
            <SView col={"xs-4"} style={{
                borderRightWidth: 1,
                borderRightColor: STheme.color.card,
            }} center height>
                <SText fontSize={14}>{label}</SText>
                {!fecha?null:<SText color={STheme.color.gray} fontSize={8}>{fecha}</SText>}
            </SView>
            <SView col={"xs-8"} row height center>

                <SView flex center>
                    <SText color={STheme.color.text} fontSize={10}>{usuario?.Nombres} {usuario?.Apellidos}</SText>
                    <SText color={STheme.color.lightGray} fontSize={10}>{usuario?.Correo}</SText>

                </SView>
                {/* <SView width={8} /> */}
                <SView width={30} height={30} style={{ borderRadius: 100, overflow: "hidden" }} card>
                    <SImage src={SSocket.api.root + "usuario/" + key_usuario} enablePreview />
                </SView>
                <SView width={8} />
            </SView>
        </SView>
    }

    render() {
        return this.renderUsuario(this.props)
    }
}
