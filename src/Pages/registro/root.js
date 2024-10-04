import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SLanguage } from 'servisofts-component';
import { AccentBar } from '../../Components';
import Container from '../../Components/Container';
import Model from '../../Model';
// import SectionApis from '../login/components/SectionApis';
import BtnSend from './components/BtnSend';
import Header from './components/Header';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';

class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envio: 0
        };
        this.params = SNavigation.getAllParams();
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    icon = (name) => {
        return <SIcon
            name={name}
            fill={STheme.color.text}
            width={17}
            height={20}
        />
    }

    // getForm() {
    //     return 
    render() {
        var defaultData = {
            ...this.params,
        };
        let lenguaje = SLanguage.language;
        let titleHeader = "Registro de Staff";
        let nombre = "Nombre";
        let apellidos = "Apellidos";
        let fecha = "Fecha de nacimiento";
        let telefono = "Teléfono";
        let correo = "Correo";
        let password = "Password";
        let repPassword = "Repetir password";
        if (lenguaje == "en") {
            titleHeader = "Staff registration";
            nombre = "Name";
            apellidos = "Last name";
            fecha = "Date of birth";
            telefono = "Phone";
            correo = "Email";
            password = "Password";
            repPassword = "Repeat password";
        }
        return (
            <SPage  >
                <SView col={"xs-12"} center>
                    <SView col={"xs-11"} >
                        <SIcon name={"Logo"} fill={STheme.color.primary} width={80} height={43} />
                        <SHr height={10} />
                    </SView>
                    <Header title={titleHeader} />
                    <SHr height={20} />
                    <Container>
                        {/* <SView col={"xs-12"} center>
                        <SText fontSize={26} color={STheme.color.text}>Registro</SText>
                    </SView>
                    <SHr height={20} /> */}
                        <SForm
                            ref={(form) => { this.form = form; }}
                            col={"xs-12"}
                            inputProps={{
                                col: "xs-12",
                                separation: 12
                            }}
                            style={{
                                alignItems: "center",
                            }}
                            inputs={{
                                Nombres: { label: "Nombres", placeholder: nombre, isRequired: true, defaultValue: defaultData.Nombres, icon: this.icon("InputUser") },
                                Apellidos: { label: "Apellidos", placeholder: apellidos, defaultValue: defaultData.Apellidos, icon: this.icon("InputUser") },
                                // Fecha: { label:"Fecha de nacimiento",placeholder: fecha, isRequired: false, defaultValue: defaultData.fecha, type: "date", icon: this.icon("InputPhone") },
                                Telefono: {
                                    label: "Teléfono", placeholder: telefono, type:"phone" , defaultValue: defaultData.Telefono, 
                                },
                                Correo: { label: "Correo", placeholder: correo, type: "email", defaultValue: defaultData.Correo, icon: this.icon("InputEmail") },
                                nivel_ingles: { label: "Nivel de inglés", placeholder: correo, type: "select", isRequired: true, defaultValue: "", icon: this.icon("InputEmail"), options: [{ key: "", content: "SELECCIONAR" }, { key: "NINGUNO", content: "NINGUNO" }, { key: "BASICO", content: "BASICO" }, { key: "MEDIO", content: "MEDIO" }, { key: "AVANZADO", content: "AVANZADO" }] },
                                papeles: { label: "¿Está autorizado para trabajar en los Estados Unidos?", placeholder: correo, type: "select", isRequired: true, defaultValue: "", icon: this.icon("InputEmail"), options: [{ key: "", content: "SELECCIONAR" }, { key: "SI", content: "SI" }, { key: "NO", content: "NO" }] },

                                // FechaNacimiento: {placeholder: "Fecha de Nacimiento", isRequired: false, type: "date", },
                                //telefono: {placeholder: "Celular", isRequired: true, type: "telefono", isRequired:true},
                                // Telefono: {placeholder: "Celular", isRequired: false, type: "phone" },
                                Password: { label: "Contraseña", placeholder: password, isRequired: true, type: "password", icon: this.icon("LockOutline") },
                                RepPassword: { label: "Repetir contraseña", placeholder: repPassword, type: "password", isRequired: true, icon: this.icon("Repassword") },
                            }}
                            onSubmit={(values) => {

                                // Model.usuario.Action.registro(values);
                                // SNavigation.replace('/');




                                // Model.usuario.Action.registro({
                                //     data: { ...values }
                                // }).then(resp => {
                                //     var usuario = resp.data;
                                //     Model.usuario.Action.loginByKey({
                                //         usuario: usuario.Correo,
                                //         password: usuario.Password
                                //     }).then(resp => {
                                //         SNavigation.replace("/");
                                //     })
                                // }).catch(e => {
                                //     SPopup.alert(`Ya existe un usuario con este ${e?.error}.`)
                                // })





                                // Model.usuario.Action.validateRegistro({
                                //     ...values,
                                //     Telefono: "+591 xxxxxxx"
                                // }).then(resp => {
                                //     if (!this.params.type) {
                                //         SNavigation.navigate("/registro/password", {
                                //             ...this.params,
                                //             ...values,
                                //         })
                                //     } else {
                                //         SNavigation.navigate("/registro/telefono", {
                                //             ...this.params,
                                //             ...values,
                                //         })
                                //     }
                                // }).catch(e => {
                                //     SPopup.alert("Ya existe un usuario con este correo.")
                                // })


                                if (values["Password"] != values["RepPassword"]) {
                                    if (lenguaje == "en") {
                                        SPopup.alert('Passwords do not match');
                                    } else {
                                        SPopup.alert('Las contraseñas no coinciden');
                                    }

                                    return null;
                                }

                                if (this.state.envio == 0) {
                                    if (lenguaje == "en") {
                                        SPopup.alert('You must accept the terms and conditions');
                                    } else {
                                        SPopup.alert('Debes aceptar los términos y condiciones');
                                    }
                                    // var error = "Debes aceptar los términos y condiciones"
                                    // SPopup.open({ key: "errorRegistro", content: this.alertError(error) });
                                } else {
                                    var password = CryptoJS.MD5(values["Password"]).toString();
                                    delete values["RepPassword"]
                                    Model.usuario.Action.registro({
                                        data: { ...values, Password: password }
                                    }).then(resp => {
                                        Model.usuario.Action.loginByKey({
                                            usuario: values["Correo"],
                                            password: password

                                        }).then(resp => {
                                            // Model.empresa.Action.setEmpresa(null)
                                            SNavigation.reset("/");
                                        }).catch(e => {
                                            if (lenguaje == "en") {
                                                SPopup.alert('Error starting with the new user');
                                            } else {
                                                SPopup.alert("Error al iniciar con el nuevo usuario");
                                            }
                                            SNavigation.reset("/");
                                        })
                                        // SNavigation.replace('/');

                                    }).catch(e => {
                                        if (lenguaje == "en") {
                                            SPopup.alert('There is already a user with this email.');
                                        } else {
                                            SPopup.alert("Ya existe un usuario con este correo.")
                                        }
                                    })

                                }

                            }}
                        />
                        <SHr height={20} />
                        <SView col={"xs-12"} row>
                            <SView
                                col={'xs-1'}
                                onPress={() => {
                                    this.setState(this.state.envio == 0 ? { envio: 1 } : { envio: 0 });
                                }}>
                                <SIcon
                                    name={this.state.envio != 0 ? 'IconCheckedOk' : 'IconChecked'}
                                    fill={STheme.color.text}
                                    width={20}
                                    height={20}></SIcon>
                            </SView>
                            <SView
                                col={'xs-11'}
                                onPress={() => {
                                    SNavigation.navigate('/terminos');
                                }}>
                                <SText
                                    color={STheme.color.text}
                                    fontSize={14}
                                    style={{ textDecorationLine: 'underline' }} language={{
                                        es: 'He leído y acepto los términos de uso y la Política de Privacidad',
                                        en: 'I have read and accept the terms of use and the Privacy Policy'
                                    }} />
                            </SView>
                        </SView>
                        <SHr height={20} />

                        <SView col={'xs-12'} row>
                            <SView col={'xs-6'} >
                                <SView onPress={() => {
                                    SNavigation.goBack()
                                }}
                                    style={{
                                        backgroundColor: STheme.color.secondary,
                                        borderRadius: 10,
                                    }} width={80} height={50} center>
                                    <SText color={STheme.color.text} fontSize={16} language={{
                                        es: "Atrás",
                                        en: "Back"
                                    }} />
                                </SView>
                            </SView>
                            <SView col={'xs-6'} style={{ alignItems: "flex-end" }}>
                                <SView onPress={() => this.form.submit()}>
                                    <SIcon name={'next2'} style={{ width: 50, height: 50 }} />
                                </SView>
                            </SView>
                        </SView>

                        {/* <PButtom onPress={() => this.form.submit()}>{"Registrar"}</PButtom> */}

                        <SHr height={30} />
                        {/* <SectionApis /> */}
                    </Container>
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);