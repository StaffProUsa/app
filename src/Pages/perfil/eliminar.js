import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SView, STheme, SForm, SPopup, SImage, SLoad, SStorage, SButtom, SIcon, SWebView, STable2, SMath, SDate, SList, } from 'servisofts-component';
import { WebView } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
// import { PButtom } from '../../Components';
import PButtomDanger from '../../Components/PButtomDanger';
// import usuario_dato from '../../Model/tapeke/usuario_dato';


class eliminar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    load_data() {
        this.data = Model.usuario.Action.getUsuarioLog();
        return this.data;
    }

    getInfo() {
        if (!this.load_data()) return <SLoad />
        return (
            <SView card col={"xs-11"} style={{ padding: 25 }}>
                <SText center color={STheme.color.primary} fontSize={22} >Eliminar tu cuenta de Casa Grande</SText>
                <SView height={15} />
                <SView
                    row
                    col={'xs-12'}
                    center
                    style={{
                        borderBottomWidth: 2,
                        borderBottomColor: STheme.color.card
                    }}></SView>
                <SView height={15} />
                <SText fontSize={18} >¿Qué ocurre si elimino mi cuenta definitivamente?</SText>
                <SView height={15} />
                <SText fontSize={15} >No podrás iniciar sesión en la app.</SText>
                <SText fontSize={15} >La eliminación de tu cuenta será definitiva.</SText>
                <SText fontSize={15} >Al eliminar tu cuenta, perderás todos tus datos y no podrás recuperarlos.</SText>
                <SView height={20} />
                <SView center>
                    <SView width={130} center height={130} style={{ backgroundColor: STheme.color.white, borderRadius: 85 }}>
                        <SIcon name='eliminarCuenta' width={80} height={80} fill={STheme.color.danger} />
                    </SView>
                </SView>
                <SView height={30} />
                <SView center>
                    <PButtomDanger primary fontSize={20} onPress={() => {
                        SPopup.confirm({
                            title: "Eliminar cuenta", message: "¿Estás seguro de eliminar la cuenta?", onPress: () => {
                                Model.usuario.Action.editar({
                                    data: {
                                        ...this.data,
                                        estado: 0
                                    },
                                }
                                );
                                Model.usuario.Action.CLEAR() //Limpiar caché
                                Model.usuario.Action.unlogin();
                            }
                        })
                    }}>ELIMINAR CUENTA</PButtomDanger>
                </SView>
                <SView height={36} />
            </SView>
        )
    }
    render() {
        return (
            <>
                <SPage title={'Eliminar mi cuenta'} onRefresh={() => {
                    Model.usuario.Action.CLEAR();
                }}
                    center
                >
                    {/* <SView center> */}
                    <SView col={"xs-11 md-6 xl-4"} center>
                        <SView height={16} />
                        {/* <SView col={"xs-12"} center>
                            <SText color={"#DE5738"} fontSize={18} >MIS DATOS</SText>
                        </SView> */}
                        {this.getInfo()}
                    </SView>
                    {/* <RolDeUsuario data={this.data} /> */}
                    {/* </SView> */}
                </SPage>
            </>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(eliminar);