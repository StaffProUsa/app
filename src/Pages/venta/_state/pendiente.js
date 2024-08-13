import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SLoad, SText, STheme, SView, SIcon, SThread } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import { Container } from '../../../Components';
import ContadorTiempo from '../Components/ContadorTiempo';
import SShared from '../../../Components/SShared';
import PagarEnEfectivo from '../Components/PagarEnEfectivo';
import PagarCortesia from '../Components/PagarCortesia';

export default class pendiente extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        if (!this.props.data.qrid) {
            this.solicitarQR();
        } else {
            this.obtenerQRExistete();
        }
        this.isRun = true;
        this.hilo();

    }

    hilo() {
        new SThread(10000, "verificar_pago", false).start(() => {
            if (!this.isRun) return;
            this.hilo();
            if (this.props.reload) this.props.reload();

        })
    }
    componentWillUnmount() {
        this.isRun = false;
    }
    solicitarQR() {
        const { key, total, razon_social, nit } = this.props.data
        this.setState({ loading: true })
        SSocket.sendPromise({
            component: "venta",
            type: "pago_qr",
            key_usuario: Model.usuario.Action.getKey(),
            key_venta: key,
            descripcion: "Pago por compra en app.",
            razon_social: razon_social ?? "S/N",
            nit: nit ?? "S/N",
            monto: total,
            correos: []
        }).then(e => {
            this.setState({ qrdata: e?.data, loading: false })
        }).catch(e => {
            this.setState({ loading: false })
        })
    }
    getQR() {
        if (!this.state.qrdata) return <SView center height={260} card width={260}>
            <SLoad />
        </SView>;

        return <SView width={260} height={260}
            border={'transparent'} center style={{
                overflow: 'hidden',
                borderRadius: 8,
            }}>
            <SImage
                src={"data:image/jpeg;base64," + this.state?.qrdata?.qrImage}
                style={{
                    resizeMode: "cover"
                }}
            />
        </SView>
    }

    obtenerQRExistete() {
        const { key, qrid } = this.props.data
        this.setState({ loading: true })
        SSocket.sendPromise({
            component: "solicitud_qr",
            type: "getByQr",
            qrid: qrid
        }).then(e => {
            this.setState({ qrdata: e?.data, loading: false })
        }).catch(e => {
            this.setState({ loading: false })
        })
    }
    render() {
        return <SView col={"xs-12"} center>
            <Container>
                <SHr h={20} />
                <SText bold fontSize={14} center>Escanee el código QR a continuación en su aplicación BANCA MÓVIL para completar el pago.</SText>
                <SHr h={20} />
                {/* <SText>{JSON.stringify(this.state)}</SText> */}

                {this.getQR()}

                <SHr />
                <SText color={STheme.color.lightGray} >{this.state?.qrdata?.qrid}</SText>
                <SHr h={20} />
                <SView width={260}>
                    <SLoad type='bar' color={STheme.color.accent} />
                </SView>
                <SHr h={20} />
                <SText bold >Pendiente de pago</SText>
                <SHr h={20} />

                {this.state.loading ? <SLoad /> :
                    <SText underLine onPress={() => {
                        // this.componentDidMount();
                        if (this.props.reload) this.props.reload();
                    }}>Verificar</SText>
                }

                <SHr />
                <PagarEnEfectivo data={this.props.data} />
                <SHr />
                <PagarCortesia data={this.props.data} />
                <SHr h={20} />
                <SView col={"xs-12"} border="transparent" row >
                    <SView flex center>
                        <SView height={60} colSquare center style={{ backgroundColor: 'white', borderRadius: 8, borderColor: STheme.color.black, borderWidth: 2, padding: 8 }} onPress={() => {
                            SShared.saveB64("data:image/jpeg;base64," + this.state?.qrdata?.qrImage)
                        }}>
                            <SIcon name={"Descargar"} fill={STheme.color.black} />
                        </SView>
                    </SView>
                    <SView flex center>
                        <SView height={60} colSquare center style={{ backgroundColor: 'white', borderRadius: 8, borderColor: STheme.color.black, borderWidth: 2, padding: 8 }} onPress={() => {
                            SShared.sharedB64("data:image/jpeg;base64," + this.state?.qrdata?.qrImage, { message: "", titulo: "" })
                        }}>
                            <SIcon name={"Compartir"} fill={STheme.color.black} />
                        </SView>
                    </SView>
                </SView>
                <SHr height={32} />


                <ContadorTiempo data={this.props?.data} onEndTime={() => {
                    // if (this.props.reload) this.props.reload({ state: "timeout_reserva" })
                }} />
            </Container>
            {/* <SText>{JSON.stringify(this.props.data)}</SText> */}
        </SView>
    }
}
