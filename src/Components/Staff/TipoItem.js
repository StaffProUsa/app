import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SImage, SNavigation, SText, STheme, SUtil, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import SVideo from '../SVideo';
import ImageBlur from '../ImageBlur';
import PFecha from '../PFecha';
import Container from '../Container';

const HEIGHT = Dimensions.get('window').height / 4.5
export default class TipoItem extends Component {
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
        SNavigation.navigate("/evento", { key: this.props.data?.key })
    }
    render() {
        const { data } = this.props;
        console.log("data", data)
        const { descripcion, observacion, actividades } = data;
        // const firstActivity = actividades[0]
        const imgPath = SSocket.api.root + 'staff/' + data?.key;
        console.log("imgPath", imgPath)
        // const fecha = new SDate(data.fecha, "yyyy-MM-dd")
        // dia:.toString('dd'),
        // mes: new SDate(data.fecha).toString('MONTH'),
        return <SView width={55}  center style={{overflow:"hidden"}}>
            <SImage src={imgPath} style={{
                resizeMode: "cover", width: 50, height: 50,
                borderRadius: 6,
                overflow: "hidden",
                borderColor: STheme.color.darkGray,
                borderWidth: 1
            }} />
            <SView col={"xs-8"}>
                <SText center fontSize={9}>{data?.descripcion}</SText>
            </SView>
        </SView>
    }
}
