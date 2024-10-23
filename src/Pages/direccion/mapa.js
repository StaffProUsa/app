import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SHr, SIcon, SImage, SLoad, SNavigation, SPage, SText, STheme, SView, SInput, SPopup, SNativeModules, SThread, SGeolocation } from 'servisofts-component';

import Model from '../../Model';
import { GeolocationMapSelect } from 'servisofts-rn-geolocation'
import PopupAutoCompleteDireccion from './Components/PopupAutoCompleteDireccion';
import { Platform } from 'react-native';
import PButtom from '../../Components/PButtom';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                direccion: "Coronel Ignacio Warnes, Calle 24 de Septiembre, Bartos, Municipio Santa Cruz de la Sierra, Provincia Andrés Ibáñez, Santa Cruz, 3212, Bolivia",
                latitude: -17.783327600000007,
                longitude: -63.182140799999985

            }
        };
        this.callback = SNavigation.getParam("callback");
        this.hiddeDescripcion = SNavigation.getParam("hiddeDescripcion");
        this.hiddeReferencia = SNavigation.getParam("hiddeReferencia");

        // if (typeof this.callback != "function") {
        //     SNavigation.replace("/")
        // }
    }
    componentDidMount() {
        if (Platform.OS != "web") {
            SNativeModules.setSoftInputMode("adjustResize")
        }
        new SThread(1000, "centrar_mapa", false).start(() => {
            if (this.map) {
                let map = this.map.getMap()
                if (map) {
                    // SGeolocation2.getCurrentPosition({
                    //     enableHighAccuracy: true,
                    //     maximumAge: 10000,
                    //     timeout: 15000
                    // }).then(e => {
                    //     console.log(e.coords)
                    //     map.animateToRegion({
                    //         latitude: e.coords.latitude,
                    //         longitude: e.coords.longitude,
                    //         latitudeDelta: 0.003,
                    //         longitudeDelta: 0.003
                    //     })
                    // })

                    map.center();
                }
            }
        })
    }
    componentWillUnmount() {
        if (Platform.OS != "web") {
            SNativeModules.setSoftInputMode("adjustPan")
        }
    }

    getImput() {
        if (this.hiddeDescripcion) return null;
        // if (this.hiddeReferencia) return null;
        //  if (!this.props.state.direccion_usuarioReducer.miDireccion) return null;
        return <SView col={"xs-12"} >
            <SInput fontSize={16} placeholder={"Nombre de la Ubicación"}
                isRequired={true}
                height={48}
                ref={(ref) => { this.inpNombreUbicacion = ref }}
            />
        </SView>
    }

    getComponentBottom() {
        return <SView col={"xs-12 sm-10 md-8 lg-6 xl-4"} height={200} row center>
            <SHr height={10} />
            <SView col={"xs-11"} center row border={'transparent'}>
                {/* {this.getImput()} */}
                <SHr height={5} />
                <SView col={"xs-12"}>
                    <SHr height={5} />
                    {/* <SInput fontSize={16} placeholder={"Referencia de la Ubicación"}
                        isRequired={true}
                        height={48}
                        ref={(ref) => { this.inpReferencia = ref }}
                    /> */}
                    <SHr />
                    <SView style={{
                        // backgroundColor: STheme.color.card,
                        borderColor: STheme.color.card,
                        borderWidth: 1,
                        height: 45,
                        borderRadius: 16,
                        alignItems: 'center',
                        padding: 4,
                        paddingStart: 16
                    }} onPress={() => {
                        SPopup.open({
                            key: "autocomplete", content:
                                <PopupAutoCompleteDireccion region={this.state.data} callback={(resp) => {
                                    SPopup.close("autocomplete");
                                    this.state.data = resp;
                                    console.log(resp)
                                    // this.state.region = resp;
                                    this.map.getMap().animateToRegion({
                                        ...resp,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01
                                    }, 1000);

                                    // this.state.dirType = "autoComplete"
                                    // this.state.nombre = resp.direccion;
                                    this.setState({ ...this.state });
                                }} />
                        });
                    }} >
                        <SView row center height>
                            <SView flex style={{
                                justifyContent: 'center',
                            }} >
                                <SText style={{
                                    fontSize: 12,
                                    color: STheme.color.text,
                                }}>{this.state?.data?.direccion ? `${this.state?.data?.direccion.substring(0, 40)}${this.state?.data?.direccion.length > 40 ? "..." : ""}` : ""}</SText>
                            </SView>
                            <SIcon name={"Search"} width={40} height={18} fill={STheme.color.text} />
                        </SView>
                    </SView>
                </SView>
                <SHr />
            </SView>
            <SHr />
            <SView col={"xs-12"} row center border={'transparent'} height={25}>
                <SView width={35} center>
                    <SIcon name={'LocationTapeke'} height={14} width={14} />
                </SView>
                <SView width={205} center onPress={() => {
                    this.map?.getMap().center();
                    // this.map.getMap().ce
                    // console.log("TODO: center map")
                }}>
                    <SText fontSize={14} center underLine bold>Use current location</SText>
                </SView>
            </SView>
            <SHr />
            <SView col={"xs-8.8"} row center border={'transparent'}  >
                <PButtom secondary loading={this.state.loading} fontSize={16} onPress={() => {
                    // if (!this.hiddeReferencia) {
                    // }
                    var data = {
                        latitude: this.state?.data?.latitude,
                        longitude: this.state?.data?.longitude,
                        direccion: this.state?.data?.direccion,
                    }
                    if (this.callback) {
                        this.callback(data);
                        // SNavigation.goBack();
                    } else {
                        console.log("Sadasdn kas ", data)
                    }
                }}>ELEGIR ESTA UBICACIÓN</PButtom>
            </SView>
            <SHr height={10} />
        </SView>
    }
    render() {
        return (
            <SPage center disableScroll>
                <GeolocationMapSelect
                    ref={(map) => this.map = map}
                    // icon={<SIcon name="MarcadorMapa" width={30} height={30} />}
                    onChange={(evt) => {
                        this.setState({ data: evt })
                    }} />
                {this.getComponentBottom()}
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);