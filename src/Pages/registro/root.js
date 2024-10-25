import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SLanguage, SThread } from 'servisofts-component';
import { AccentBar } from '../../Components';
import Container from '../../Components/Container';
import Model from '../../Model';
// import SectionApis from '../login/components/SectionApis';
import BtnSend from './components/BtnSend';
import Header from './components/Header';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
import InputSelect from "../../Components/NuevoInputs/InputSelect"
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
            Telefono: "+1 ",
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
        let nivel_ingles = "Nivel de inglés";
        let papeles = "¿Está autorizado para trabajar en los Estados Unidos?";
        if (lenguaje == "en") {
            titleHeader = "Staff registration";
            nombre = "Name";
            apellidos = "Last name";
            fecha = "Date of birth";
            telefono = "Phone";
            correo = "Email";
            password = "Password";
            repPassword = "Repeat password";
            nivel_ingles = "English level";
            papeles = "Are you authorized to work in the United States?";
        }
        return (
            <SPage  >
                <SView col={"xs-12"} center>
                    <SView col={"xs-11"} >
                        <SHr height={10} />
                        <SIcon name={"Logo"} fill={STheme.color.text} width={80} height={43} />
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
                                Nombres: {
                                    label: SLanguage.select({
                                        es: "Nombre",
                                        en: "Name"
                                    }), placeholder: SLanguage.select({ es: "Nombre", en: "First Name" }), isRequired: true, defaultValue: defaultData.Nombres, icon: this.icon("InputUser")
                                },
                                Apellidos: { label: SLanguage.select({ es: "Apellidos", en: "Last name" }), isRequired: true, placeholder: apellidos, defaultValue: defaultData.Apellidos, icon: this.icon("InputUser") },
                                fecha_nacimiento: { label: SLanguage.select({ es: "Fecha de nacimiento", en: "Date of Birth" }), placeholder: fecha, isRequired: false, defaultValue: defaultData.fecha_nacimiento, type: "date", icon: this.icon("cumple") },
                                estado_civil: {
                                    label: SLanguage.select({ es: "Estado civil", en: "Marital Status" }),
                                    placeholder: SLanguage.select({ es: "Estado civil", en: "Marital Status" }),
                                    // type: "select",
                                    isRequired: true,
                                    defaultValue: "",
                                    editable: false,
                                    onPress: e => {
                                        InputFloat.open({
                                            e: e,
                                            height: 180,
                                            width: 150,
                                            style: {
                                                backgroundColor: STheme.color.background
                                            },
                                            render: () => {
                                                return <SView col={"xs-12"} flex card>
                                                    <InputSelect
                                                        data={["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED", "OTHER"]}
                                                        onChange={val => {
                                                            this.form.setValues({ "estado_civil": val })
                                                        }}
                                                        ITEM_HEIGHT={30} />
                                                </SView>
                                            }
                                        })
                                    },
                                    icon: this.icon("estadoCivil")
                                    // icon: this.icon("InputEmail"),
                                    // options: [{ key: "", content: (lenguaje == "en") ? "SELECT" : "SELECCIONAR" },
                                    // { key: "NONE", content: (lenguaje == "en") ? "NONE" : "NINGUNO" }, { key: "BASIC", content: (lenguaje == "en") ? "BASIC" : "BASICO" }, { key: "MEDIUM", content: (lenguaje == "en") ? "MEDIUM" : "MEDIO" }, { key: "ADVANCED", content: (lenguaje == "en") ? "ADVANCED" : "AVANZADO" }]
                                },
                                "employee_number": {
                                    placeholder: SLanguage.select({ es: "Número de empleado", en: "Employee number" }),
                                    label: SLanguage.select({ es: "Número de empleado", en: "Employee number" }),
                                    defaultValue: defaultData.employee_number,
                                    icon: this.icon("empleado")
                                    //type: 'phone',
                                    //isRequired: true,
                                },
                                Telefono: {
                                    label: SLanguage.select({ es: "Número de teléfono", en: "Phone Number" }), isRequired: true, placeholder: SLanguage.select({ es: "Número de teléfono", en: "Phone Number" }), type: "phone", defaultValue: defaultData.Telefono,
                                },

                                Correo: { label: SLanguage.select({ es: "Correo", en: "Email" }), isRequired: true, placeholder: SLanguage.select({ es: "Correo", en: "Email" }), type: "email", defaultValue: defaultData.Correo, icon: this.icon("InputEmail") },
                                direccion: {
                                    label: SLanguage.select({ es: "Dirección de domicilio", en: "Home Address" }), isRequired: true, placeholder: SLanguage.select({ es: "Dirección de domicilio", en: "Home Address" }), defaultValue: defaultData.direccion, icon: this.icon("direccion")
                                },
                                nivel_ingles: {
                                    label: SLanguage.select({ es: "Nivel de inglés", en: "English level" }),
                                    placeholder: SLanguage.select({ es: "Nivel de inglés", en: "English level" }),
                                    // type: "select",
                                    isRequired: true,
                                    defaultValue: "",
                                    editable: false,
                                    onPress: e => {
                                        InputFloat.open({
                                            e: e,
                                            height: 180,
                                            width: 150,
                                            style: {
                                                backgroundColor: STheme.color.background
                                            },
                                            render: () => {
                                                return <SView col={"xs-12"} flex card>
                                                    <InputSelect
                                                        data={["NONE", "BASIC", "MEDIUM", "ADVANCED"]}
                                                        onChange={val => {
                                                            this.form.setValues({ "nivel_ingles": val })
                                                        }}
                                                        ITEM_HEIGHT={30} />
                                                </SView>
                                            }
                                        })
                                    },
                                    icon: this.icon("lenguaje"),
                                    // options: [{ key: "", content: (lenguaje == "en") ? "SELECT" : "SELECCIONAR" },
                                    // { key: "NONE", content: (lenguaje == "en") ? "NONE" : "NINGUNO" }, { key: "BASIC", content: (lenguaje == "en") ? "BASIC" : "BASICO" }, { key: "MEDIUM", content: (lenguaje == "en") ? "MEDIUM" : "MEDIO" }, { key: "ADVANCED", content: (lenguaje == "en") ? "ADVANCED" : "AVANZADO" }]
                                },
                                otros_idiomas: {
                                    label: SLanguage.select({ es: "Idiomas que habla", en: "Languages Spoken" }), isRequired: true, placeholder: SLanguage.select({ es: "Idiomas que habla", en: "Languages Spoken" }), defaultValue: defaultData.otros_idiomas, icon: this.icon("lenguaje"),
                                },
                                papeles: { col: "xs-12", label: SLanguage.select({ es: "¿Está autorizado legalmente para trabajar en los Estados Unidos?", en: "Are you legally authorized to work in the United State?" }), type: "checkBox" },

                                // FechaNacimiento: {placeholder: "Fecha de Nacimiento", isRequired: false, type: "date", },
                                //telefono: {placeholder: "Celular", isRequired: true, type: "telefono", isRequired:true},
                                // Telefono: {placeholder: "Celular", isRequired: false, type: "phone" },
                                Password: { label: password, placeholder: password, isRequired: true, type: "password", icon: this.icon("LockOutline") },
                                RepPassword: { label: repPassword, placeholder: repPassword, type: "password", isRequired: true, icon: this.icon("Repassword") },
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
                                            new SThread(1000, "asdasd").start(() => {
                                                SNavigation.replace("/onLogin")

                                            })
                                        }).catch(e => {
                                            if (lenguaje == "en") {
                                                SPopup.alert('Error starting with the new user');
                                            } else {
                                                SPopup.alert("Error al iniciar con el nuevo usuario");
                                            }
                                            // SNavigation.reset("/");
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
                                    <SText color={STheme.color.white} fontSize={16} language={{
                                        es: "Atrás",
                                        en: "Back"
                                    }} />
                                </SView>
                            </SView>
                            <SView col={'xs-6'} style={{ alignItems: "flex-end" }}>
                                <SView onPress={() => this.form.submit()}>
                                    <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
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