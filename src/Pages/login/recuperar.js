import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SHr, SLoad, SThread } from 'servisofts-component';
import { SButtom, SDate, SForm, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SLanguage } from 'servisofts-component';
// import { Container, PButtom } from '../../Components';
import Container from '../../Components/Container';
import PButtom from '../../Components/PButtom';


import Model from '../../Model';

class recuperar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("key");
        this.key_rol = SNavigation.getParam("key_rol");
        if (!this.key_rol) {
            this.key_rol = "d16d800e-5b8d-48ae-8fcb-99392abdf61f";
        }
    }
    componentDidMount() {
        new SThread(100, "render_window").start(() => {
            this.setState({ ready: true })
        })
    }
    getForm() {
        return <SForm
            ref={(ref) => { this.form = ref; }}
            row
            style={{
                justifyContent: "space-between",
            }}
            inputProps={{
                col: "xs-12",
            }}
            inputs={{
                correo: {
                    placeholder: "email@example.com", type: "email", isRequired: true, icon: (
                        <SIcon
                            name={'InputEmail'}
                            fill={STheme.color.primary}
                            width={17}
                            height={20}
                        />
                    )
                },
            }}

            onSubmit={(values) => {
                Model.usuario.Action.recuperarPass({ correo: (values.correo + "").toLowerCase() }).then(resp => {
                    SNavigation.navigate("/login/recuperar_codigo");
                }).catch(e => {
                    console.error(e);
                })
            }}
        />
    }

    render() {
        // var error = Usuario.Actions.getError("recuperarPass", this.props);
        // if (error) {
        //     SPopup.alert("Usuario no encontrado, Verifique sus datos.");
        // }
        // if (this.props.state.usuarioReducer.estado == "exito" && this.props.state.usuarioReducer.type == "recuperarPass") {
        //     this.props.state.usuarioReducer.estado = "";
        //     SNavigation.navigate(Usuario.component + "/codigoRecuperarContrasena");
        // }
        return (
            <SPage titleLanguage={{ es: "Recuperar Contraseña", en: "Recover Password" }}>
                <SView center>
                    <Container loading={!this.state.ready}>
                        <SView height={40} />
                        <SText fontSize={16} color={STheme.color.text} center language={{
                            es: "Le enviaremos un mensaje para configurar o restablecer su nueva contraseña.",
                            en: "We will send you a message to set or reset your new password."
                        }} />
                        <SView height={40} />
                        {this.getForm()}
                        <SView height={16} />
                        <SView col={"xs-11"} row center>
                            <PButtom onPress={() => {
                                this.form.submit();
                            }}><SText color={STheme.color.black} language={{
                                es: "ENVIAR CÓDIGO",
                                en: "SEND CODE"
                            }} /></PButtom>
                        </SView>
                        <SHr />
                        <SHr />
                        <SHr />
                        <SView col={"xs-11"} row center onPress={() => {
                            SNavigation.navigate("/login/recuperar_codigo");
                        }}>
                            <SText fontSize={14} style={{
                                textDecorationLine: "underline",
                            }} language={{
                                es: "¡Ya tengo un código!",
                                en: "I already have a code!"
                            }} />
                        </SView>
                        <SView height={36} />
                    </Container>
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(recuperar);