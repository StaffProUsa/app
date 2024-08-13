import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SDate, SHr, SNavigation, SText, STheme, SUtil } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import SVideo from '../SVideo';
import ImageBlur from '../ImageBlur';
import PFecha from '../PFecha';

const HEIGHT = Dimensions.get('window').height / 1.8
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
    render() {
        const { data } = this.props;
        const { descripcion, observacion, actividades } = data;
        const firstActivity = actividades[0]
        const imgPath = SSocket.api.repo + 'actividad/' + firstActivity?.key;
        const fecha = new SDate(data.fecha, "yyyy-MM-dd")
        // dia:.toString('dd'),
        // mes: new SDate(data.fecha).toString('MONTH'),
        return <View style={{
            width: "100%",
            alignItems: "center"
        }}>
            <TouchableOpacity style={{
                width: "100%",
                maxWidth: 500,
                backgroundColor: STheme.color.card,
            }} activeOpacity={0.8} onPress={this.handlePress}>
                <View style={{ width: "100%", height: HEIGHT }}>
                    {firstActivity?.tipo == "video" ?
                        <SVideo ref={ref => this.video = ref} src={imgPath} paused={true} />
                        : <ImageBlur src={imgPath} height={"100%"} />
                    }
                </View>
                <View style={{ width: "100%", minHeight: 150 }}>
                    <View style={{ width: "80%", padding: 8, }}>
                        <SText fontSize={16} style={{ textTransform: 'uppercase' }}>{descripcion}</SText>
                        <SHr h={10} />
                        <SText fontSize={13} color={STheme.color.lightGray}>{SUtil.limitString(observacion, 200)}</SText>
                    </View>
                    <PFecha
                        dia={fecha.toString("dd")}
                        mes={fecha.toString("MONTH")}
                        backgroundColor={STheme.color.secondary}
                        spacing={45}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }
}
