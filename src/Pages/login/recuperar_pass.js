import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { SButtom, SDate, SForm, SIcon, SLoad, SNavigation, SPage, SPopup, SText, STheme, SView, SLanguage } from 'servisofts-component';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';
import Model from '../../Model';


class recuperar_pass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.user_to_rec = SNavigation.getAllParams();
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
                separation: 16
            }}
            inputs={{
                Password: {
                    placeholder: "Introduce tu nueva contraseña", isRequired: true, type: "password", icon: (
                        <SIcon
                            name={'LockOutline'}
                            fill={STheme.color.text}
                            width={17}
                            height={20}
                        />
                    )
                },
                RepPassword: {
                    placeholder: "Confirma tu nueva contraseña", type: "password", isRequired: true, icon: (
                        <SIcon
                            name={'LockOutline'}
                            fill={STheme.color.text}
                            width={17}
                            height={20}
                        />
                    )
                },
            }}
            onSubmit={(values) => {
                if (values["Password"] != values["RepPassword"]) {
                    SPopup.open({ content: this.alertErrorPassword() });
                    return null;
                }
                values["Password"] = CryptoJS.MD5(values["Password"]).toString();
                delete values["RepPassword"]

                Model.usuario.Action.cambiarPassByCodigo({ password: values.Password, usuario_recuperado: this.user_to_rec }).then(resp => {
                    console.log(resp);
                    SNavigation.reset("/login")
                    // var usr_rec = resp.data;
                    // SNavigation.navigate("/login/recuperar_pass", usr_rec);
                }).catch(e => {
                    console.error(e);
                })
                // Usuario.Actions.cambiarPassByCodigo(values, this.props);
            }}
        />
    }

    alertErrorPassword() {
        return <SView col={"xs-11 md-8 xl-6"} row center style={{ height: 250, borderRadius: 8, }} backgroundColor={STheme.color.background} >
            <SView col={"xs-11"} height={40} />
            <SView col={"xs-11"}  >
                <SIcon name={"InputPassword"} height={100} fill={STheme.color.secondary} />
            </SView>
            <SView col={"xs-11"} height={15} />
            <SView col={"xs-12"} center  >
                <SText center color={STheme.color.darkGray} style={{ fontSize: 18, fontWeight: "bold" }}>Las contraseñas no coinciden</SText>
            </SView>
            <SView col={"xs-11"} height={30} />
        </SView>
    }

    render() {
        return (
            <SPage titleLanguage={{ es: "Registrar nueva contraseña", en: "Register new password" }} >
                <SView center>
                    <SView col={"xs-11 md-6 xl-4"} center>
                        <SView height={40} />
                        <SText fontSize={24} color={STheme.color.text} bold center language={{
                            es: "¡Restablece tu contraseña!",
                            en: "Reset your password!"
                        }}/>
                        <SView height={30} />

                        {this.getForm()}
                        <SView height={30} />
                        <SView col={"xs-11"} row center>
                            <PButtom rojo
                                onPress={() => {
                                    this.form.submit();
                                }} >
                                    <SText color={STheme.color.white} language={{
                                        es: "RESTABLECER CONTRASEÑA",
                                        en: "RESET PASSWORD"
                                    }}/></PButtom>
                        </SView>
                        <SView height={36} />
                    </SView>
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(recuperar_pass);