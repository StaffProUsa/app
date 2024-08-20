import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SLoad, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Config from '../../../Config';
import ImgShared from '../../../Components/ImgShared';

export default class EventoQR extends Component<{ key_evento: any }> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            service: "sqr",
            component: "qr",
            type: "registro",
            estado: "cargando",
            data: {
                content: Config.URLDeepLink + "/link/evento?key=" + this.props.key_evento,
                content_type: "text",
                errorCorrectionLevel: "M",
                type_color: "solid",
                colorBody: "#ffffff",
                image_src: "https://staffprousa.servisofts.com/logo192.png",
                body: "CircleConectVH",
                framework: "Rounded",
                header: "Circle",
                detail: "Default"
            }
        }).then(e => {
            this.setState({ dataQr: e.data })
        }).catch(e => {
            console.error(e);
        })
    }
    getQr() {
        if (!this.state?.dataQr) return null
        return "data:image/png;base64," + this.state.dataQr?.b64
    }
    render() {
        return <SView col={"xs-9"} colSquare backgroundColor={STheme.color.black} style={{ padding: 12, borderRadius: 4 }} center>
            {!this.state.dataQr ? <SLoad /> : <SImage src={this.getQr()} enablePreview />}
            <SHr />
            <SText onPress={() => {
                ImgShared.compartir(this.getQr(), Config.URLDeepLink + "/link/evento?key=" + this.props.key_evento,);
            }} bold>{"Compartir QR"}</SText>
        </SView>
    }
}
