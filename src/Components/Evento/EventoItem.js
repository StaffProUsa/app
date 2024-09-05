import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SNavigation, SText, STheme, SUtil, SView, SLanguage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import SVideo from '../SVideo';
import ImageBlur from '../ImageBlur';
import PFecha from '../PFecha';
import Container from '../Container';

const HEIGHT = Dimensions.get('window').height / 4.6
export default class EventoItem extends Component {
    video: SVideo
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onViewIn() {
        if (this.video?.play) this.video.play();

    }
    onViewOut() {
        if (this.video?.pause) this.video.pause();
    }

    handlePress = () => {
        if (!this.props?.data?.key) return;
        SNavigation.navigate("/evento", { key: this.props.data.key })
    }

    renderPuestos = ({ label, cantidad }) => {
        return <SView height={32} width={105}
            style={{
                borderRadius: 15,
                backgroundColor: STheme.color.darkGray,
                padding: 4,
            }} row center>
            <SView width={70} heigh>
                <SText fontSize={9} style={{ color: STheme.color.text, lineHeight: '1.2' }}>{label}</SText>
            </SView>
            <SView width={25} height style={{ alignItems: "flex-end" }}>
                <SView width={25} height={25} backgroundColor={STheme.color.background}
                    style={{ borderRadius: 35 }} center>
                    <SText fontSize={12} style={{ color: STheme.color.text }}>x{cantidad}</SText>
                </SView>
            </SView>
        </SView>
    }
    render() {
        const { data } = this.props;
        const { descripcion, observacion, actividades, ubicacion , key} = data;
        const firstActivity = actividades[0]
        const imgPath = SSocket.api.repo + 'actividad/' + firstActivity?.key;
        const fecha = new SDate(data.fecha, "yyyy-MM-dd")
        // dia:.toString('dd'),
        // mes: new SDate(data.fecha).toString('MONTH'),
        return <View style={{
            width: "100%",
            alignItems: "center",

        }} >



            <SView col={"xs-12"} style={{
                padding: 10,
                borderWidth: 1,
                borderColor: STheme.color.darkGray,
                borderRadius: 16,
                overflow: "hidden"
            }} row onPress={() => {
                SNavigation.navigate("/evento", { key: this.props.data.key })
            }}>
                <SGradient
                    colors={['#040405', '#0C0C10']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                />
                <SView col={"xs-4"} >
                    <View style={{ width: "100%", height: HEIGHT, borderRadius: 12, overflow: "hidden" }}>
                        {firstActivity?.tipo == "video" ?
                            <SVideo ref={ref => this.video = ref} src={imgPath} paused={true} />
                            : <ImageBlur src={imgPath} height={"100%"} />
                        }
                    </View>
                </SView>
                <SView col={"xs-0.3"} />
                <SView col={"xs-7.2"} padding={5}>
                    <SText fontSize={16} style={{ textTransform: 'uppercase' }}>{descripcion}</SText>
                    <SHr h={7} />
                    <SView row col={"xs-12"}>
                        <SView row col={"xs-1"}>
                            <SIcon width={10} name={"iubicacion"} fill={STheme.color.text} />
                        </SView>
                        <SView row col={"xs-11"}>
                            <SText fontSize={10} style={{ color: STheme.color.gray, textDecorationLine: "underline" }}>{ubicacion?.descripcion}</SText>
                        </SView>
                    </SView>
                    <SHr h={5} />
                    <SView row col={"xs-12"}>
                        <SView row col={"xs-1"}>
                            <SIcon width={10} name={"idate"} />
                        </SView>
                        <SView row col={"xs-11"}>
                            <SText fontSize={10} style={{ color: STheme.color.gray }}>{new SDate(data.fecha).toString('DAY')}, {new SDate(data.fecha).toString('MONTH')} {new SDate(data.fecha).toString('dd')}</SText>
                        </SView>
                    </SView>
                    <SHr h={7} />
                    <SText fontSize={12} style={{ textTransform: 'uppercase' }} language={{
                        es: "REQUIERE:",
                        en: "REQUIRES:"
                    }} />
                    <SHr h={5} />
                    <SView row col={"xs-12"}>
                        {!data.pendientes ? null : data.pendientes.map(p => this.renderPuestos({ label: p.descripcion, cantidad: p.cantidad }))}
                    </SView>
                </SView>
            </SView>

        </View>
    }
}
