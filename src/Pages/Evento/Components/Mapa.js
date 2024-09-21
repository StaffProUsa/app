import React, { Component } from "react";
import { connect } from "react-redux";
import {
    SHr,
    SIcon,
    SImage,
    SMarker,
    SMapView,
    SPage,
    SText,
    STheme,
    SView,
    SNavigation,
    SMapView2,
    SLanguage,
} from "servisofts-component";
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

        var { cliente } = this.props?.data ?? {};
        if(!cliente) return null;
        var latitude = cliente.latitude;
        var longitude = cliente.longitude;
        // if (ubicacion?.latitude) latitude = ubicacion.latitude
        // if (ubicacion?.longitude) longitude = ubicacion.longitude
        if (!latitude || !longitude) return null;
            return (
                <SView col={"xs-12"} row center>
                    <SHr height={40} />
                    <SView col={"xs-12"} {...this.props} center>
                        <SView col={"xs-12"} height={350}>
                            <SMapView
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
                                <SMapView.SMarker width={35} height={45} latitude={latitude} longitude={longitude} >
                                    <SView width={35} height={45} >
                                        <SIcon name={"iconMap"} width={35} height={45} />
                                    </SView>
                                </SMapView.SMarker>
                            </SMapView>
                            <SView col={"xs-12"} height style={{
                                position: "absolute",
                                // backgroundColor: "#f0f"
                            }} withoutFeedback>

                            </SView>
                        </SView>
                        <SHr height={20} />
                        <SView col={"xs-12"} row center>
                            <SIcon name="iubicacion" fill={STheme.color.text} width={15} height={18} />
                            <SView width={5} />
                            <SText fontSize={14} bold color={STheme.color.text} language={{
                                es: "Dirección:",
                                en: "Address:"
                            }} />
                            <SView width={10} />
                            <SText fontSize={14} color={STheme.color.gray}>
                                {cliente?.direccion ?? ""}
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
                            <SText color={STheme.color.text} center fontSize={16} language={{
                                es: "Ir a Google Maps",
                                en: "Go to Google Maps"
                            }} />
                        </BtnNavegar>
                        <SHr height={40} />
                    </SView>
                </SView>
            );
    }
}
export default Mapa;
