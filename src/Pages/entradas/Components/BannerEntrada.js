import React, { Component } from 'react';
import { View, Text, Vibration } from 'react-native';
import { SIcon, SImage, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import EntradaQR from './EntradaQR';
import Model from '../../../Model';
import ImageFast from '../../../Components/ImageFast';
import SSocket from 'servisofts-socket';


const ImageSize = {
    width: 720,
    height: 1280
}
export default class BannerEntrada extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            scale: 0,
            showQr: false,
            key_usuario: this.props.key_usuario,
            key_evento: this.props.key_evento
        };
        // this.key_entrada = SNavigation.getParam("key_entrada", t)
        this.key_entrada = this.props.key_entrada
        
    }
    componentDidMount() {
        this.state.key_usuario = this.props.key_usuario;
        this.getUsuario(this.props.key_usuario)
    }
    getUsuario = (key) => {
        if (!key) return;
        Model.usuario.Action.getByKeyAsync({ key: key }).then(e => {
            this.setState({ usuario: e.data, nombre: e?.data?.Nombres + " " + e?.data?.Apellidos })
        }).catch(e => {
            console.error(e)

        })
    }
    render() {
        if (this.props.key_usuario != this.state.key_usuario) {
            this.componentDidMount();
        }
        console.log(SSocket.api.repo + 'upload/evento/' + this.state.key_evento +"_entrada")
        return <SView col={"xs-12"} center >
            <SView col={"xs-12 sm-10 md-8 lg-6 xl-4 xxl-3"} center >
                <SView col={"xs-12"} height={this.state.height}
                    onLayout={e => {
                        const { width, height } = e.nativeEvent.layout
                        const scale = width / ImageSize.width;

                        this.setState({ width: ImageSize.width * scale, height: ImageSize.height * scale, scale: scale })
                    }} center>
                        
                    <SImage  src={ SSocket.api.repo + 'evento/' + this.state.key_evento +"_entrada" } />
                    <SView style={{
                        top: 718 * this.state.scale,
                        position: "absolute",
                        backgroundColor: "#FFF",
                        width: 545 * this.state.scale,
                        height: 84 * this.state.scale,
                        borderRadius: 14 * this.state.scale,
                        borderWidth: 3 * this.state.scale,
                        borderColor: "#000"
                    }} center>
                        <SText color={"#000"} fontSize={30 * this.state.scale} center bold>{this.state.nombre}</SText>
                    </SView>
                    <SView style={{
                        top: 855 * this.state.scale,
                        position: "absolute",
                        backgroundColor: "#000",
                        opacity:"0.85",
                        width: 270 * this.state.scale,
                        height: 270 * this.state.scale,
                        borderRadius: 14 * this.state.scale,
                        borderWidth: 3 * this.state.scale,
                        borderColor: "#000",
                        overflow: 'hidden',
                    }} center onPress={() => {
                        Vibration.vibrate(300)
                        this.setState({ showQr: true })
                    }}>
                        {!this.state.showQr ? <SIcon  name="Logo" fill={STheme.color.primary}  style={{
                            width: "50%", height: "50%",
                        }} /> : <EntradaQR key_entrada={this.key_entrada} col={"xs-12"} style={{
                            padding: 12 * this.state.scale
                        }} />}

                    </SView>
                </SView>
            </SView>
        </SView>
    }
}
