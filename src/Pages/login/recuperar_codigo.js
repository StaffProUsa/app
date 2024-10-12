import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SLoad } from 'servisofts-component';
import { SButtom, SDate, SForm, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SLanguage } from 'servisofts-component';
import PButtom from '../../Components/PButtom';
import Model from '../../Model';

class recuperar_codigo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onChangeLanguage(language) {
        this.setState({...this.state})
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    getForm() {
        let lenguaje = SLanguage.language;
        let mensaje = "Ingrese el código recibido";
        let mensajeError = "Código erróneo, verifique nuevamente.";
        let mensajeError2 = "Ha ocurrido un error al introducir el código.";
        if (lenguaje == "en") {
            mensaje = "Enter the received code";
            mensajeError = "Incorrect code, please verify.";
            mensajeError2 = "An error occurred while entering the code.";
        }
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
                Codigo: {
                    placeholder: mensaje, type: "text", isRequired: true, icon: (
                        <SIcon
                            name={'InputPassword'}
                            fill={STheme.color.text}
                            width={17}
                            height={20}
                        />
                    )
                },
            }}
            error={this.state.error}

            onSubmit={(values) => {
                Model.usuario.Action.verificarCodigoPass({ codigo: values.Codigo }).then(resp => {
                    var usr_rec = resp.data;
                    SNavigation.navigate("/login/recuperar_pass", usr_rec);
                }).catch(e => {
                    console.error(e);
                    if (e?.error == "error_datos") {
                        this.setState({ loading: false, error: mensajeError })
                    } else {
                        this.setState({ loading: false, error: mensajeError2 })
                    }
                })
            }}
        />
    }

    render() {
        return (
            <SPage titleLanguage={{ es: "Código de Recuperación", en: "Recovery Code" }} >
                <SView center>
                    <SView col={"xs-11 md-6 xl-4"} center>
                        <SView height={40} />
                        <SText fontSize={24} color={STheme.color.text} center language={{
                            es: "¡Mensaje Enviado!",
                            en: "Message Sent!"
                        }} />
                        <SView height={10} />
                        <SText fontSize={16} color={STheme.color.text} center language={{
                            es: "Revise su bandeja de entrada e introduzca el código recibido.",
                            en: "Check your inbox and enter the received code."
                        }} />
                        <SView height={40} />
                        <SView
                            backgroundColor={STheme.color.card}
                            width={150}
                            height={150}
                            style={{
                                borderRadius: 35
                            }}
                            center>
                            <SIcon name={"InputEmail"} fill={STheme.color.text} width={120} height={120} />
                        </SView>
                        <SView height={36} />
                        {this.getForm()}
                        <SView height={16} />
                        <SView col={"xs-11"} row center>
                            <PButtom rojo
                                onPress={() => {
                                    this.form.submit();
                                }}><SText color={STheme.color.white} language={{
                                    es: "VALIDAR",
                                    en: "VALIDATE"
                                }} /></PButtom>
                        </SView>
                        <SView height={36} />
                    </SView>
                    {/* <RolDeUsuario data={this.usr} /> */}
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(recuperar_codigo);