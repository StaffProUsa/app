import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SInput, SLanguage, SNotification, Submit, Upload, SThread } from 'servisofts-component';
import { AccentBar } from '../../Components';
import Container from '../../Components/Container';
import Model from '../../Model';
// import SectionApis from '../login/components/SectionApis';
import SSocket from "servisofts-socket"
import BtnSend from './components/BtnSend';
import Header from './components/Header';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';

class foto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envio: 0
        };
        this.params = SNavigation.getAllParams();
    }
    icon = (name) => {
        return <SIcon
            name={name}
            fill={STheme.color.primary}
            width={17}
            height={20}
        />
    }
    footer() {
        return <SView col={'xs-12'} row center>
            <SView col={'xs-11'} row>
                <SView col={'xs-6'} >
                    {/* <SView onPress={() => {
                       
                        SNavigation.goBack()
                    }}
                        style={{
                            backgroundColor: STheme.color.secondary,
                            borderRadius: 10,
                        }} width={80} height={50} center>
                        <SText color={STheme.color.text} fontSize={16}>Atrás</SText>
                    </SView> */}
                </SView>
                <SView col={'xs-6'} style={{ alignItems: "flex-end" }}>
                    <SView onPress={() => {
                        const value = this.foto.getValue()
                        if (!value || value.length <= 0) {
                            SNotification.send({
                                title: SLanguage.select({
                                    en: "Incomplete Information",
                                    es: "Información Incompleta"
                                }),
                                body: SLanguage.select({
                                    en: "Please upload a profile picture to continue.",
                                    es: "Por favor, sube una foto de perfil para continuar."
                                }),
                                color: STheme.color.warning,
                                time: 5000,
                            })
                            return;
                        }
                        const key_usuario = Model.usuario.Action.getKey();
                        SNotification.send({
                            key: "upload",
                            title: SLanguage.select({
                                en: "Uploading image...",
                                es: "Subiendo imagen..."
                            }),
                            type: "loading",
                        })
                        Upload.sendPromise(value[0], SSocket.api.root + "upload/usuario/" + key_usuario).then(e => {
                            console.log(e);
                            SNotification.remove("upload")
                            // SNavigation.goBack();
                            SNavigation.reset("/");
                            new SThread(1000, "asdasd").start(() => {
                                SNavigation.replace("/onLogin")

                            })
                        }).catch(e => {
                            SNotification.send({
                                title: SLanguage.select({
                                    en: "Error",
                                    es: "Error"
                                }),
                                body: e,
                                color: STheme.color.danger,
                                time: 5000,
                            })
                            SNotification.remove("upload")
                            console.error(e);
                        })
                        // SNavigation.navigate("/registro/categorias")

                    }}>
                        <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
                    </SView>
                </SView>
            </SView>
            <SHr height={20} />
        </SView>
    }
    render() {
        var defaultData = {
            ...this.params,
        };
        return (
            <SPage footer={this.footer()}
            >
                <SView col={"xs-12"} center>
                    <SView col={"xs-11"} >
                        <SHr height={10} />
                        <SIcon name={"Logo"} fill={STheme.color.text} width={80} height={43} />
                        <SHr height={10} />
                    </SView>
                    <Header title={SLanguage.select({
                        en: "Upload a photo of yourself.",
                        es: "Sube una foto de ti."
                    })} />
                    <SHr height={20} />
                    <SView col={"xs-11"} >
                        <SText fontSize={16} center language={{
                            en: "Please upload a photo of yourself, ensuring that your face is clearly visible.",
                            es: "Por favor, sube una foto tuya asegurándote de que tu rostro sea claramente visible.",
                        }} />
                    </SView>
                    <SHr height={50} />
                    <Container>
                        <SView width={300} height={300} style={{
                            position: "absolute",
                            top: 0
                        }}>
                            <SIcon name={"foto"} fill={STheme.color.primary} />
                        </SView>
                        <SInput ref={ref => this.foto = ref} type='image' height={300}
                            style={{

                            }}
                        />


                        {/* <SHr height={30} /> */}



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
export default connect(initStates)(foto);