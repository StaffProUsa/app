import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SForm, SHr, SIcon, SInput, SNavigation, SPage, SPopup, SText, STheme, SThread, SView, SLanguage, SStorage } from 'servisofts-component';
import Model from '../../Model';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';
import LoginFacebook from '../../LoginApis/LoginFacebook';
import LoginGoogle from '../../LoginApis/LoginGoogle';
import LoginApple from '../../LoginApis/LoginApple';
import PBarraFooter from '../../Components/PBarraFooter';
import { Container } from '../../Components';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.ruta = SNavigation.getParam('ruta');
        console.log(this.ruta);
        // this.key_invitacion = SStorage.getItem('key_company')
        SStorage.getItem("key_invitacion", resp => {
            if (!resp) return;
            try {
                this.key_invitacion = resp;
            } catch (e) {
                console.error(e);
            }
        })
    }

    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        new SThread(100, "espera").start(() => {
            this.setState({ ready: true })
        })
        SLanguage.addListener(this.onChangeLanguage.bind(this))
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    getFilter() {
        return (
            <SView col={'xs-11 sm-10 md-8 lg-6 xl-6'} height={50} row>
                <SView
                    col={'xs-6'}
                    height
                    backgroundColor={STheme.color.primary}
                    center>
                    <SButtom
                        outline={this.state.filter != 'Pendiente'}
                        onPress={() => {
                            this.setState({ filter: 'Pendiente' });
                        }}>
                        Inicio Sesión
                    </SButtom>
                </SView>
                <SView
                    col={'xs-6'}
                    height
                    center
                    backgroundColor={STheme.color.lightGray}>
                    <SButtom
                        outline={this.state.filter != 'Historial'}
                        onPress={() => {
                            SNavigation.navigate('/registro');
                        }}>
                        Registro
                    </SButtom>
                </SView>
            </SView>
        );
    }

    handleLogin(user, isNew = false) {
        SNavigation.replace("/onLogin")
        // if (isNew) {
        //     new SThread(1000, "ir_a_editar_perfil").start(() => {
        //         SNavigation.navigate("/perfil/editar")
        //     })
        // }
    }

    loginRedSocial(key_red_social: "gmail_key" | "apple_key" | "facebook_key", usuario) {
        Model.usuario.Action.loginByKey({
            usuario: usuario.id,
        }).then(e => {
            this.handleLogin(e.data);
            console.log(e);
        }).catch(e => {
            Model.usuario.Action.registro({
                data: {
                    Nombres: usuario.name,
                    Apellidos: usuario.last_name,
                    Correo: usuario.email,
                    [key_red_social]: usuario.id
                }
            }).then(e => {
                Model.usuario.Action.loginByKey({
                    usuario: usuario.id,
                }).then(resp => {
                    // Model.empresa.Action.setEmpresa(null)
                    // SNavigation.reset("/");
                    this.handleLogin(resp.data, true)
                    // SNavigation.goBack();
                    // SNavigation.goBack();
                }).catch(e => {
                    SPopup.alert("Error al iniciar con el nuevo usuario");
                })
            }).catch(ea => {
                if (ea.error_) {
                    if (ea.error_ == "Existe usuario") {
                        const key_usuario = Object.keys(ea.data_)[0];
                        if (key_usuario) {
                            Model.usuario.Action.editar({
                                data: {
                                    key: key_usuario,
                                    [key_red_social]: usuario.id,
                                    estado: 1,
                                }
                            }).then(e => {
                                Model.usuario.Action.loginByKey({
                                    usuario: usuario.id,
                                }).then(resp => {
                                    this.handleLogin(resp.data, true)
                                    // Model.empresa.Action.setEmpresa(null)
                                    // SNavigation.goBack();
                                }).catch(e => {
                                    SPopup.alert("Error al iniciar con el nuevo usuario");
                                })
                            }).catch(e => {
                                console.log(e)
                                SPopup.alert("Error al iniciar con el nuevo usuario");
                            })
                        }
                    }
                }
                // SPopup.alert("Error al registrar usuario");
                // console.error(e);
            })
        })
    }
    getSocial() {
        return (
            <SView col={'xs-12'} height={120} row center style={{
                justifyContent: "space-around"
            }}>
                {/* <SView height={70} col={'xs-12'}>
                    <LoginApple onLogin={(usuario) => {
                        this.loginRedSocial("apple_key", usuario)
                    }}>
                        <SView height={50} center row style={{ backgroundColor: '#08080B', borderRadius: 8, borderColor: STheme.color.darkGray, borderWidth: 2, padding: 8 }}>
                            <SIcon name={'IconApple'} fill={STheme.color.white} width={30} />
                            <SView width={15} />
                            <SText color={STheme.color.white} fontSize={18} language={{
                                es: "Continuar con Apple",
                                en: "Continue with Apple"
                            }} />
                        </SView>
                    </LoginApple>
                </SView> */}
                <SView height={70} col={'xs-12'}>
                    <LoginGoogle onLogin={(usuario) => {
                        console.log("onLogin", usuario)
                        this.loginRedSocial("gmail_key", usuario)
                    }}>
                        <SView height={50} center row style={{ backgroundColor: STheme.color.darkGray, borderRadius: 8, borderColor: STheme.color.darkGray, borderWidth: 2, padding: 8 }}>
                            <SIcon name={'IconGoogle'} width={30} />
                            <SView width={15} />
                            <SText color={STheme.color.white} fontSize={18} language={{
                                es: "Continuar con Google",
                                en: "Continue with Google"
                            }} />
                        </SView>
                    </LoginGoogle>
                </SView>
                <SView height={70} col={'xs-12'} onPress={() => {
                    SNavigation.navigate("/registro")
                }}>
                    <SView height={50} center row style={{ backgroundColor: STheme.color.darkGray, borderRadius: 8, borderColor: STheme.color.darkGray, borderWidth: 2, padding: 8 }}>
                        <SIcon name={'Logosolo'} fill={STheme.color.white} width={30} />
                        <SView width={15} />
                        <SText color={STheme.color.white} fontSize={18} language={{
                            es: "Crear cuenta",
                            en: "Create account"
                        }} />
                    </SView>
                </SView>
            </SView>
        );
    }

    icon = (name) => {
        return <SIcon
            name={name}
            fill={STheme.color.text}
            width={17}
            height={20}
        />
    }

    renderHeader() {
        return <SView col={'xs-12'} center>
            <SHr height={20} />
            <SView col={'xs-11'} height={100} center>
                <SIcon name={'Logo'} fill={STheme.color.text} />
            </SView>
        </SView>
    }
    renderMenssage() {
        return <SView col={'xs-12'} height={20} row center>
            <SView col={'xs-3'} height center>
                <SHr color={STheme.color.lightGray} height={1.5}></SHr>
            </SView>
            <SView col={'xs-6'} height center>
                <SText
                    fontSize={14}
                    color={STheme.color.text}
                    font={'LondonMM'} language={{
                        es: "o con tu cuenta",
                        en: "or with your account"
                    }}></SText>
            </SView>
            <SView col={'xs-3'} height center>
                <SHr color={STheme.color.lightGray} height={1.5}></SHr>
            </SView>
        </SView>
    }

    render() {
        console.log(this.key_invitacion);
        if (Model.usuario.Action.getUsuarioLog()) {
            SNavigation.goBack();
            // SNavigation.navigate("/login");
            return null;
        }
        let lenguaje = SLanguage.language;
        let correo = "Correo electrónico";
        let contrasena = "Contraseña";
        let mensajeError = "Usuario o contraseña incorrectos.";
        let mensajeError2 = "Ha ocurrido un error al iniciar sesión.";
        if (lenguaje == "en") {
            correo = "Email";
            contrasena = "Password";
            mensajeError = "Incorrect username or password.";
            mensajeError2 = "An error occurred while logging in.";
        }

        if (!this.state.ready) return this.renderHeader();
        return (
            <SPage title={''}   >
                {this.renderHeader()}
                <SHr height={30} />
                <SView col={"xs-12"} height={35} center backgroundColor={STheme.color.secondary} padding={25}>
                    <SText fontSize={23} color={STheme.color.white} language={{
                        es: "Iniciar sesión",
                        en: "Access"
                    }} />
                </SView>
                <SHr height={10} />
                <Container>
                    {/* {this.renderMenssage("Inicia sesión con")} */}

                    <SHr height={30} />
                    {this.getSocial()}
                    {/* <SText fontSize={18}>Iniciar sesión</SText> */}
                    <SHr height={30} />
                    {this.renderMenssage()}
                    <SHr height={20} />
                    {/* {this.getFilter()} */}
                    {/* <SHr height={16} /> */}
                    <SForm
                        ref={ref => this.form = ref}
                        inputProps={{
                            separation: 8,
                            height: 40,
                        }}

                        inputs={{
                            usuario: {
                                placeholder: correo,
                                type: 'email',
                                required: true,
                                // autoFocus: true,
                                keyboardType: 'email-address',
                                onKeyPress: (evt) => {
                                    if (evt.key === 'Enter') {
                                        this.form.focus('password');
                                    }
                                },
                                icon: (
                                    <SIcon
                                        name={'InputEmail'}
                                        fill={STheme.color.text}
                                        width={17}
                                        height={20}
                                    />
                                )
                            },
                            password: {
                                placeholder: contrasena,

                                type: "password",
                                required: true,
                                onKeyPress: (evt) => {
                                    if (evt.key === 'Enter') {
                                        this.form.submit();
                                    }
                                },
                                icon: (
                                    <SIcon
                                        name={'InputPassword'}
                                        fill={STheme.color.text}
                                        width={17}
                                        height={20}
                                    />
                                )
                            }
                        }}
                        loading={this.state.loading}
                        error={this.state.error}
                        // onSubmitName={"Ingresar"}
                        onSubmitProps={{
                            type: "outline"
                        }}
                        onSubmit={(data) => {
                            data["password"] = CryptoJS.MD5(data["password"]).toString();
                            console.log(data);

                            Model.usuario.Action.login(data).then((resp) => {
                                this.handleLogin(resp.data, false)
                                // if (this.ruta) {
                                //     SNavigation.navigate("carga", { ruta: this.ruta });
                                // } else if (this.key_invitacion) {
                                //     SNavigation.reset("/invitation", { pk: this.key_invitacion });
                                // } else {
                                //     SNavigation.goBack();
                                // }
                                console.log("exito");
                            }).catch(e => {
                                // SPopup.alert("usuario no encontrado")
                                if (e?.error == "error_password") {
                                    this.setState({ loading: false, error: mensajeError })
                                } else {
                                    this.setState({ loading: false, error: mensajeError2 })
                                }
                            })
                        }}
                    />
                    <SHr height={8} />
                    {/* <PButtom
                        small
                        onPress={() => {
                            this.form.submit();
                        }}>
                        Iniciar sesión
                    </PButtom> */}

                    <SView width={180} height={50} center backgroundColor={STheme.color.secondary}
                        style={{ borderRadius: 14 }} onPress={() => {
                            this.form.submit();
                        }}>
                        <SText color={STheme.color.white} fontSize={15} language={{
                            es: "Ingresar",
                            en: "Login"
                        }} />
                    </SView>

                    <SHr height={20} />
                    <SView col={"xs-12"} center row>
                        <SText language={{
                            es: "¿Olvidaste tu contraseña?",
                            en: "Forgot your password?"
                        }} />
                        <SText onPress={() => {
                            SNavigation.navigate("/login/recuperar")
                        }} color={STheme.color.text} style={{ textDecorationLine: "underline" }} language={{
                            es: "click aquí",
                            en: "click here"
                        }} />
                    </SView>
                    <SHr height={15} />
                    {/* <SView col={"xs-12"} center row>
                        <SText language={{
                            es: "¿No tienes cuenta? ",
                            en: "Don't have an account? "
                        }} />
                        <SText onPress={() => {
                            SNavigation.navigate("/registro")
                        }} color={STheme.color.text} style={{ textDecorationLine: "underline" }} language={{
                            es: "click aquí",
                            en: "click here"
                        }} />
                    </SView> */}

                </Container>
                <SHr height={20} />

                {/* <SView col={"xs-12"} center >
                        <SText>¿No tienes una cuenta?</SText>
                        <SHr height={20} />
                        <SButtom type='secondary' style={{ textAlign: "center" }} onPress={() => {
                            SNavigation.navigate("/registro", {
                                onSelect: (a) => {
                                    this.setState({ tipo_producto: a })
                                }
                            })
                        }}>Crear nuevo usuario</SButtom>
                    </SView> */}
            </SPage >
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Login);