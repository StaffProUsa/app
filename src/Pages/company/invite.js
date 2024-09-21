import React, { Component } from 'react';
import { View, Text, Platform, Linking, Clipboard } from 'react-native';
import { SDate, SHr, SIcon, SImage, SNavigation, SNotification, SPage, SText, STheme, SView, SLanguage } from 'servisofts-component';
import { Container } from '../../Components';
// import Share from 'react-native-share'
import SSocket from 'servisofts-socket';
import Model from '../../Model';

let RNShare;

try {
    // Intenta cargar el módulo
    RNShare = require('react-native-share').default;
} catch (error) {
    console.log('El módulo "react-native-share" no está disponible');
}
export default class invite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: "",
            message: ""
        };
        this.key_company = SNavigation.getParam("key_company");
    }
    componentDidMount() {
        let usuario = Model.usuario.Action.getUsuarioLog();
        // let empresa = Model.empresa.Action.getSelect();
        let empresa = Model.company.Action.getAll()[this.key_company];
        console.log("empresas: ", empresa);
        SSocket.sendPromise({
            component: "invitacion",
            type: "registro",
            key_usuario: Model.usuario.Action.getKey(),
            key_company: this.key_company,
            data: {
                descripcion: `${empresa?.descripcion} te invita a formar parte de la empresa.`,
                observacion: "Te invitamos a formar parte de la empresa. Acepta esta invitación.",
                fecha_inicio: new SDate().toString(),
                fecha_fin: new SDate().addDay(1).toString(),
                color: STheme.color.success,
                telefono: "",
                email: "",
                url: "",
            },
        }).then(e => {
            // let page_link = 'http://192.168.3.3:3000';
            let page_link = 'https://staffprousa.servisofts.com';
            let invitation_link = `${page_link}/invitation?pk=${e.data.key}`
            let message = `
Hola te invitamos a formar parte de nuesta empresa, Presiona el link para unirte.

${invitation_link}                

Bienvenido a *${empresa?.descripcion}*
    `
            this.setState({ link: invitation_link, message: message })
            // Linking.openURL("https://wa.me/?text=" + encodeURIComponent(message))
            // console.log(invitation_link)
            // console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }


    btn({ icon, label, onPress }) {
        return <SView row col={"xs-12"} center height={60} onPress={onPress}>
            <SView width={60} height={60} center style={{
                overflow: "hidden",
            }}>
                {icon}
            </SView>
            <SView width={30} />
            <SView flex height style={{ justifyContent: "center" }}>
                <SText fontSize={18}  >{label}</SText>
            </SView>
        </SView>
    }
    render() {
        // const empresa = Model.empresa.Action.getSelect();
        const empresa = Model.company.Action.getByKey(this.key_company);
        return <SPage titleLanguage={{ es: "Crea un enlace de invitacion", en: "Create an invitation link" }} >
            <Container>
                <SHr h={40} />
                <SText fontSize={16} language={
                    {
                        es: "Cualquier persona en la app puede usar este enlace para unirse a este empresa. Compártelo solo con personas en las que confíes.",
                        en: "Anyone in the app can use this link to join this company. Share it only with people you trust."
                    }
                }/>
                <SHr h={40} />
                <SView row col={"xs-12"} center>
                    <SView width={60} height={60} style={{
                        borderRadius: 100,
                        overflow: "hidden"
                    }}>
                        <SImage src={SSocket.api.root + "company/" + this.key_company} />
                    </SView>
                    <SView width={30} />
                    <SView flex>
                        {!this.state.link ?
                            <SText fontSize={16} color={STheme.color.gray} language={{
                                es: "Creando nuevo enlace...",
                                en: "Creating new link..."
                            }} />
                            :
                            <SText fontSize={16} color={STheme.color.link} >{this.state.link}</SText>
                        }
                    </SView>
                </SView>
                <SHr h={40} />
                <SView row col={"xs-12"} center>
                    <SView width={60} height={60} style={{
                        borderRadius: 100,
                        overflow: "hidden"
                    }}>
                    </SView>
                    <SView width={30} />
                    <SView flex>
                        <SText fontSize={18}  >{empresa?.descripcion}</SText>
                        <SText fontSize={16} color={STheme.color.gray} >{empresa?.observacion}</SText>
                    </SView>
                </SView>
                <SHr h={40} />
                <SHr h={1} color={STheme.color.gray} />
                <SHr h={16} />
                {this.btn({
                    icon: <SIcon name={"out"} fill={STheme.color.gray} width={25} />, label: "Enviar enlace por WhatsApp",
                    onPress: () => {
                        Linking.openURL("https://wa.me/?text=" + encodeURIComponent(this.state.message))
                    }
                })}
                <SHr h={16} />
                {this.btn({
                    icon: <SIcon name={"share"} fill={STheme.color.gray} width={25} />, label: "Copiar enlace",
                    onPress: () => {
                        if (Platform.OS == "web") {
                            navigator.clipboard.writeText(this.state.link).then(() => {
                                SNotification.send({
                                    title: "Copy",
                                    body: "El texto fue copiado con éxito.",
                                    time: 5000
                                })
                            }).catch(e => {

                            })
                        } else {
                            Clipboard.setString(this.state.link)
                            // SNotification.send({
                            //     title: "Copy",
                            //     body: "El texto fue copiado con exito.",
                            //     time: 5000
                            // })
                        }
                    }
                })}
                <SHr h={16} />
                {/* {this.btn({
                    icon: <SIcon name={"share"} fill={STheme.color.gray} width={25} />, label: "Compartir enlace",
                    onPress: () => {

                        if (RNShare) {
                            RNShare.open({
                                message: this.state.message
                            })
                        } else {
                            SNotification.send({
                                title: "Share",
                                body: "El módulo no está disponible",
                                time: 5000,
                                color: STheme.color.danger
                            })
                        }

                    }
                })} */}
                <SHr h={16} />
            </Container>
        </SPage>
    }
}
