import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SDate, SIcon, SLoad, SPage, SText, STheme, SThread, SView, SNavigation, SImage, SLanguage, SGradient, SHr } from 'servisofts-component';
import parametro from '../../../Services/Casagrandeadmin/Components/parametro';
import venta from '../../../Services/Casagrandeadmin/Components/venta';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';
import BtnAsistencia from './BtnAsistencia';

class Asistencia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curtime: new SDate()
        };
    }

    componentDidMount() {
        this.state.run = true;
    }
    componentWillUnmount() {
        this.state.run = false;
    }

    getPerfil() {
        var usuario = Model.usuario.Action.getUsuarioLog();
        if (!usuario) {
            return <SLoad />
        }
        console.log("usuario", usuario);
        return <>
            <SView col={"xs-12"} center>
                <SView col={"xs-11 sm-10 md-6 lg-6 xl-6 xxl-6"} row center>
                    <SView col={"xs-3"} >
                        <SView
                            style={{
                                width: 80,
                                height: 80,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <SView
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: STheme.color.card,
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    borderWidth: 1,
                                    borderColor: STheme.color.card
                                }}>
                                <SImage
                                    src={`${SSocket.api.root}usuario/${usuario.key
                                        }?time=${new Date().getTime()}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: "cover"
                                    }}
                                />
                            </SView>
                        </SView>
                    </SView>
                    <SView col={"xs-1"} />
                    <SView col={"xs-8"} >
                        <SView col={"xs-12"} row >
                            <SIcon name={"User"} width={15} height={15} fill={STheme.color.text} />
                            <SView width={5} />
                            <SText fontSize={16} color={STheme.color.lightGray}>{usuario.Nombres} {usuario.Apellidos}</SText>
                        </SView>
                        <SView col={"xs-12"} row >
                            <SIcon name={"InputEmail"} width={15} height={15} fill={STheme.color.text} />
                            <SView width={5} />
                            <SText fontSize={16} color={STheme.color.lightGray}>{usuario.Correo}</SText>
                        </SView>
                    </SView>
                    <SHr height={25} />
                    <SView col={"xs-12"} >
                        <BtnAsistencia onPress={() => {
                            SNavigation.navigate("evento/token", { key: this.props.data.key});
                        }} />
                    </SView>
                </SView>
            </SView>
        </>
    }

    render() {

        return (
            <SView col={'xs-12'} style={{ borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: STheme.color.darkGray }}>
                <SGradient
                    colors={['#040405', '#0C0C10']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                />

                <SHr height={30} />
                {this.getPerfil()}
                {/* <EventoStaff key_evento={this.key} /> */}
                <SHr height={30} />
            </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Asistencia);