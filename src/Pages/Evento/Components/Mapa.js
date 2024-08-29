import React, { Component } from "react";
import { connect } from "react-redux";
import {
    SHr,
    SIcon,
    SImage,
    SMarker,
    SPage,
    SText,
    STheme,
    SView,
    SNavigation,
    SMapView2
} from "servisofts-component";
import SMapView from "servisofts-component/Component/SMapView";
import SSocket from "servisofts-socket";
import BtnNavegar from "../../../Components/BtnNavegar";
export type MapaPropsType = {
    // data: any,
};
class Mapa extends Component<MapaPropsType> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var { latitude, longitude } = this.props?.data ?? {};

        if (!latitude) latitude = -17.768507
        if (!longitude) longitude = -63.183698
        return (
            <SView col={"xs-12"} row center>
                <SView col={"xs-12"} {...this.props} center>
                    <SView col={"xs-12"} flex>
                        <SMapView2
                            initialRegion={{
                                // latitude: this.props.data?.latitude,
                                // latitude: this.props.data?.latitude,
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            options={{
                                fullscreenControl: false,
                                zoomControl: false,
                                gestureHandling: "none",
                                scrollwheel: false,
                            }}
                            preventCenter
                        >
                            <SMarker lat={latitude} lng={longitude} >
                                <SIcon name="iconMap" width={35} height={45} />
                            </SMarker>
                        </SMapView2>
                        <SView col={"xs-12"} height style={{
                            position: "absolute",
                            // backgroundColor: "#f0f"
                        }} withoutFeedback>

                        </SView>
                    </SView>
                    <SHr height={20} />
                    <SView col={"xs-12"} row center>
                        <SIcon name="iubicacion" fill={STheme.color.text} width={15} height={18} />
                        <SView width={5}/>
                        <SText fontSize={14} bold  color={STheme.color.text}>Address:</SText>
                        <SView width={10}/>
                        <SText fontSize={14}  color={STheme.color.gray}>
                            1500 Marilla St, Dallas, TX 75201
                            {/* {this.props?.data?.address ?? ""}  */}
                        </SText>
                    </SView>



                    <SHr height={20} />
                    {/* <SView
                        center
                        backgroundColor={STheme.color.darkGray}
                        width={170}
                        height={30}
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                            SNavigation.navigate("/root")
                        }}
                    >
                        <SText>Ir a Google Maps</SText>
                    </SView> */}

                    <BtnNavegar latLng={{ latitude: latitude, longitude: longitude }}
                        backgroundColor={STheme.color.darkGray}
                        width={190}
                        height={50}
                        style={{ borderRadius: 8 }}
                        center
                        row
                    >
                        <SIcon name="googleMap" fill={STheme.color.text} width={25} height={17.45} />
                        <SText color={STheme.color.text} center fontSize={16} >Go to Google Maps</SText>
                    </BtnNavegar>
                    <SHr height={40} />
                </SView>
            </SView>
        );
    }
}
export default Mapa;
