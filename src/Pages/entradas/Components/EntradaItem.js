import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SHr, SIcon, SImage, SNavigation, SText, STheme, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';

const EfectSize = 8
export default class EntradaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const { key_participante } = this.props.data;
        if (key_participante) {
            Model.usuario.Action.getByKeyAsync({ key: key_participante }).then(e => {
                this.setState({ participante: e.data })
            })
        }

    }
    efect1() {
        return <>
            <SView width={EfectSize} height={EfectSize} style={{
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: STheme.color.secondary,
                borderBottomRightRadius: 50,
                zIndex: 999
            }} />
            <SView width={EfectSize} height={EfectSize} style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                backgroundColor: STheme.color.secondary,
                borderTopRightRadius: 50,
                zIndex: 999
            }} />
        </>
    }
    efect2() {
        return <>
            <SView width={EfectSize} height={EfectSize} style={{
                position: 'absolute',
                right: 0,
                top: 0,
                backgroundColor: STheme.color.secondary,
                borderBottomLeftRadius: 50,
                zIndex: 999
            }} />
            <SView width={EfectSize} height={EfectSize} style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                backgroundColor: STheme.color.secondary,
                borderTopLeftRadius: 50,
                zIndex: 999
            }} />
        </>
    }

    handleParticiparInvitar() {
        const { key } = this.props.data;
        SNavigation.navigate("/entradas/invite", { key_entrada: key })
        // console.log(link)
    }
    renderParticipante() {
        const { key_participante, numero } = this.props.data;
        if (!key_participante) return <SView height={24} />;
        // if (!key_participante) return <SText color={STheme.color.link} fontSize={12} underLine onPress={this.handleParticiparInvitar.bind(this)}>Invita a un amigo.</SText>
        return <SView row center>
            <SView width={24} height={24} style={{ borderRadius: 100, overflow: "hidden", borderColor: STheme.color.text, borderWidth: 1 }} card>
                <SImage src={SSocket.api.root + "usuario/" + key_participante} enablePreview />
            </SView>
            <SView flex style={{
                justifyContent: "center",
                paddingStart: 4
            }}>
                <SText color={STheme.color.text} fontSize={10}>{this.state?.participante?.Nombres} {this.state?.participante?.Apellidos}</SText>
            </SView>
        </SView >
    }
    renderEntregado() {
        const { fecha_entrega } = this.props.data;
        if (!fecha_entrega) return null;
        return <SText color={STheme.color.danger} fontSize={12} bold style={{
            position: "absolute",
            width: 88,
            height: 20,
            textAlign: "center",
            transform: [{ rotate: "-45deg" }]
        }}>{"ENTREGADO"}</SText>
    }
    render() {
        const { evento, tipo_entrada, color, fecha_evento, key, numero, fecha_entrega } = this.props.data;
        return <SView style={{
            width: "100%",
            flexDirection: "row"
        }} onPress={() => {
            SNavigation.navigate("/entradas/profile", { key_entrada: key })
        }}>
            <SView col={"xs-9"} height style={{
                backgroundColor: STheme.color.card,
                borderLeftWidth: 3,
                borderColor: color ?? STheme.color.text,
                borderRadius: 4,
               

            }}>
                {this.efect2()}
                <SView flex padding={8}>
                    <SText bold fontSize={14} color={STheme.color.text}>{evento}</SText>
                    <SText fontSize={12} color={STheme.color.text}>{tipo_entrada}</SText>
                    <SHr height={3} />
                    <SView col={"xs-12"} style={{ alignItems: "flex-start" }} row >
                        {/* <SText style={{ textAlign: "left" }} fontSize={15} color={STheme.color.gray}>FECHA: </SText> */}
                        <SText style={{ textAlign: "left" }} fontSize={12} color={STheme.color.gray}>{new SDate(fecha_evento, "yyyy-MM-ddThh:mm:ss").toString("DAY, dd de MONTH")}</SText>
                    </SView>
                    <SHr height={3} />
                    {this.renderParticipante()}



                    {/* <SText col={"xs-12"} style={{ textAlign: "right" }} fontSize={12} color={STheme.color.gray}>{new SDate(fecha_evento, "yyyy-MM-ddThh:mm:ss").toString("DAY, dd de MONTH")}</SText> */}
                </SView>

                <SView height style={{
                    position:"absolute",
                    top:0,
                    right:0,
                    borderRightColor: STheme.color.card,
                    borderRightWidth: 2,
                    borderRightStyle: "dashed",
                }} />
            </SView>

            <SView col={"xs-3"} row style={{ alignItems: "flex-end" }} height card>
                {this.efect1()}
                <SView col={"xs-8"} height center>
                    <SText fontSize={17} bold># {numero}</SText>
                    {fecha_entrega ?
                        <SView col={"xs-12"} center>
                            <SHr height={4} />
                            <SView
                                row
                                col={'xs-8'}
                                center
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: STheme.color.card
                                }} />
                            <SText fontSize={20} bold> {new SDate(fecha_entrega).getDay()}</SText>
                            <SText fontSize={12} bold> {new SDate(fecha_entrega).toString("MONTH")}</SText>
                        </SView>
                        : null}


                </SView>
                <SView col={"xs-4"} height style={{
                    backgroundColor: color ?? STheme.color.text,
                    // borderRadius: 4,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 4,
                    borderTopRightRadius: 4,

                }} center>
                    {/* <SText fontSize={20} bold># {numero}</SText> */}
                    {this.renderEntregado()}
                    {/* <SView col={"xs-12"} height padding={10} center>
                    <SImage src={require("../../../Assets/images/qr.png")} />
                </SView>
                <SView style={{
                    position: "absolute",
                    backgroundColor: "#000000AA",
                    width: 80,
                    borderRadius: 4,
                    padding: 4,
                    borderWidth: 1,
                    // borderColor: STheme.color.warning,
                }} row center>
                    <SIcon name='Lock' width={16} />
                    <SView width={4} />
                    <SText bold>VER QR</SText>
                </SView> */}

                </SView>
            </SView>

        </SView>
    }
}
