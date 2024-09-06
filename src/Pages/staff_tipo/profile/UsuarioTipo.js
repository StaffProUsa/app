import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SList, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import usuario from '../../usuario';

export default class UsuarioTipo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuarios: {}
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "staff_tipo_favorito",
            type: "getAll",
            key_staff_tipo: this.props.key_staff_tipo
        }).then(e => {
            let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))];
            keys = keys.filter(e => !this.state?.usuarios[e]);
            if (keys.length <= 0) return;
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: keys,
            }).then(resp => {
                if (!this.state?.usuarios) this.state.usuarios = {};
                this.state.usuarios = {
                    ...this.state.usuarios,
                    ...resp.data
                }
                this.setState({ usuarios: this.state.usuarios, data: e.data })
            }).catch(e2 => {
                SPopup.alert(e2.error)
            })
        }).catch(e => {
            console.error(e);
        })
    }

    $item(obj) {
        const usuario = this.state?.usuarios[obj.key_usuario]?.usuario;
        return <SView col={"xs-12"}
            padding={8}
            row
            // onPress={super.$onSelect.bind(this, obj)}
            style={{
                borderBottomWidth: 1,
                borderColor: STheme.color.card
            }}>
            <SView width={40} height={40} style={{
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: STheme.color.card
            }}>
                <SImage src={SSocket.api.root + "usuario/" + obj.key_usuario} />
            </SView>
            <SView width={8} />
            <SView flex style={{ justifyContent: "center" }}>
                <SText bold fontSize={16}>{usuario.Nombres} {usuario.Apellidos}</SText>
                <SText color={STheme.color.lightGray}>{usuario.Telefono}</SText>
            </SView>
        </SView>
    }
    render() {
        const { key_staff_tipo } = this.props;
        return (
            <SView col={"xs-12"}>
                <SText
                    fontSize={16}
                    bold
                    language={{
                        en: "User list",
                        es: "Lista de usuarios"
                    }} />
                <SHr />
                <SList
                    buscador
                    data={this.state.data}
                    render={this.$item.bind(this)} />
            </SView>
        );
    }
}
