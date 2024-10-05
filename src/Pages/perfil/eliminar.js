import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SView, SLanguage, STheme, SForm, SPopup, SImage, SLoad, SStorage, SButtom, SIcon, SWebView, STable2, SMath, SDate, SList, } from 'servisofts-component';
import { WebView } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
// import { PButtom } from '../../Components';
import PButtomDanger from '../../Components/PButtomDanger';
import Degradado from '../../Components/Degradado';
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
                <Degradado />
                <SText center color={STheme.color.text} fontSize={22} language={
                    {
                        es: "Eliminar tu cuenta en StaffProUsa",
                        en: "Delete your account in StaffProUsa"
                    }
                } />
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
                <SText fontSize={18} language={{
                    es: "¿Qué ocurre si elimino mi cuenta definitivamente?",
                    en: "What happens if I delete my account permanently?"
                }} />
                <SView height={15} />
                <SText fontSize={15} language={{
                    es: "No podrás iniciar sesión en la app.",
                    en: "You will not be able to log in to the app."
                }} />
                <SText fontSize={15} language={{
                    es: "La eliminación de tu cuenta será definitiva.",
                    en: "The deletion of your account will be permanent."
                }} />
                <SText fontSize={15} language={{
                    es: "Al eliminar tu cuenta, perderás todos tus datos y no podrás recuperarlos.",
                    en: "By deleting your account, you will lose all your data and you will not be able to recover them."
                }} />
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
                    }}>
                        <SText language={{
                            es: "ELIMINAR CUENTA",
                            en: "DELETE ACCOUNT"
                        }} />
                    </PButtomDanger>
                </SView>
                <SView height={36} />
            </SView>
        )
    }
    render() {
        return (
            <>
                <SPage titleLanguage={{
                    es: "Eliminar mi cuenta",
                    en: "Delete my account"
                }} onRefresh={() => {
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