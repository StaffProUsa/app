import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SForm, SHr, SIcon, SInput, SNavigation, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component';
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
    }
    componentDidMount() {
        new SThread(100, "espera").start(() => {
            this.setState({ ready: true })
        })
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

    loginRedSocial(key_red_social: "gmail_key" | "apple_key" | "facebook_key", usuario) {
        Model.usuario.Action.loginByKey({
            usuario: usuario.id,
        }).then(e => {
            SNavigation.goBack();
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
                    SNavigation.goBack();
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
                                    // Model.empresa.Action.setEmpresa(null)
                                    SNavigation.goBack();
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
                <SView height={70} col={'xs-12'}>
                    <LoginApple onLogin={(usuario) => {
                        this.loginRedSocial("apple_key", usuario)
                    }}>
                        <SView height={50} center row style={{ backgroundColor: '#08080B', borderRadius: 8, borderColor: STheme.color.darkGray, borderWidth: 2, padding: 8 }}>
                            <SIcon name={'IconApple'} fill={STheme.color.white} width={30} />
                            <SView width={15} />
                            <SText color={STheme.color.white} fontSize={18}>Continuar con Apple</SText>
                        </SView>
                    </LoginApple>
                </SView>
                <SView height={70} col={'xs-12'}>
                    <LoginGoogle onLogin={(usuario) => {
                        console.log("onLogin", usuario)
                        this.loginRedSocial("gmail_key", usuario)
                    }}>
                        <SView height={50} center row style={{ backgroundColor: '#08080B', borderRadius: 8, borderColor: STheme.color.darkGray, borderWidth: 2, padding: 8 }}>
                            <SIcon name={'IconGoogle'} width={30} />
                            <SView width={15} />
                            <SText color={STheme.color.white} fontSize={18}>Continuar con Google</SText>
                        </SView>
                    </LoginGoogle>
                </SView>
            </SView>
        );
    }

    icon = (name) => {
        return <SIcon
            name={name}
            fill={STheme.color.primary}
            width={17}
            height={20}
        />
    }

    renderHeader() {
        return <SView col={'xs-12'} center>
            <SHr height={20} />
            <SView col={'xs-11'} height={100} center>
                <SIcon name={'Logo'} fill={STheme.color.primary} />
            </SView>
        </SView>
    }
    renderMenssage(label) {
        return <SView col={'xs-12'} height={20} row center>
            <SView col={'xs-3'} height center>
                <SHr color={STheme.color.lightGray} height={1.5}></SHr>
            </SView>
            <SView col={'xs-6'} height center>
                <SText
                    fontSize={14}
                    color={STheme.color.text}
                    font={'LondonMM'}>{label}</SText>
            </SView>
            <SView col={'xs-3'} height center>
                <SHr color={STheme.color.lightGray} height={1.5}></SHr>
            </SView>
        </SView>
    }

    render() {
        if (Model.usuario.Action.getUsuarioLog()) {
            SNavigation.goBack();
            // SNavigation.navigate("/login");
            return null;
        }

        if (!this.state.ready) return this.renderHeader();
        return (
            <SPage title={''} hidden  >
                {this.renderHeader()}
                <SHr height={30} />
                <SView col={"xs-12"} height={35} center backgroundColor={STheme.color.secondary} padding={25}>
                    <SText fontSize={23}>Iniciar sesión</SText>
                </SView>
                <SHr height={10} />
                <Container>
                    {/* {this.renderMenssage("Inicia sesión con")} */}

                    <SHr height={30} />
                    {this.getSocial()}
                    {/* <SText fontSize={18}>Iniciar sesión</SText> */}
                    <SHr height={30} />
                    {this.renderMenssage("o con tu cuenta")}
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
                                placeholder: "Correo electrónico",
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
                                        fill={STheme.color.primary}
                                        width={17}
                                        height={20}
                                    />
                                )
                            },
                            password: {
                                placeholder: "Contraseña",

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
                                        fill={STheme.color.primary}
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
                                if (this.ruta) {
                                    SNavigation.navigate("carga", { ruta: this.ruta });
                                } else {
                                    SNavigation.goBack();
                                }
                                console.log("exito");
                            }).catch(e => {
                                // SPopup.alert("usuario no encontrado")
                                if (e?.error == "error_password") {
                                    this.setState({ loading: false, error: "Usuario o contraseña incorrectos." })
                                } else {
                                    this.setState({ loading: false, error: "Ha ocurrido un error al iniciar sesión." })
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
                        style={{ borderRadius: 14 }}>
                        <SText color={STheme.color.white} fontSize={15}>Login</SText>
                    </SView>

                    <SHr height={20} />
                    <SView col={"xs-12"} center row>
                        <SText>¿Olvidaste tu contraseña? </SText>
                        <SText onPress={() => {
                            SNavigation.navigate("/login/recuperar")
                        }} color={STheme.color.text} style={{ textDecorationLine: "underline" }}>click aquí</SText>
                    </SView>
                    <SHr height={15} />
                    <SView col={"xs-12"} center row>
                        <SText>¿No tienes cuenta? </SText>
                        <SText onPress={() => {
                            SNavigation.navigate("/registro")
                        }} color={STheme.color.text} style={{ textDecorationLine: "underline" }}>click aquí</SText>
                    </SView>

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