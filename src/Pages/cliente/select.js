import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SGeolocation, SHr, SInput, SMapView, SNavigation, SNotification, SPage, SText, STheme, SView, SLanguage, SIcon, SPopup } from 'servisofts-component';
import PopupAutoCompleteDireccion from '../direccion/Components/PopupAutoCompleteDireccion';
import Model from '../../Model';
import SSocket from 'servisofts-socket';

export default class select extends Component {
    map: SMapView;
    constructor(props) {
        super(props);
        this.state = {
            latitude: SNavigation.getParam("latitude"),
            longitude: SNavigation.getParam("longitude"),
            direccion: SNavigation.getParam("direccion"),
            ready_to_geocode: false,
        };
        this.onSelect = SNavigation.getParam("onSelect")
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        let lenguaje = SLanguage.language;
        if (this.state.latitude || this.state.longitude) {

            this.map.animateToRegion({ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 })
        } else {
            this.ready_to_geocode = true;
            SGeolocation.getCurrentPosition({

            }).then(e => {
                this.map.animateToRegion({ latitude: e.coords.latitude, longitude: e.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 })
            }).catch(e => {
                SNotification.send({
                    title: "Error",
                    body: (lenguaje == "es") ? "No pudimos optener tu ubicación" : "We couldn't get your location",
                    color: STheme.color.danger,
                    time:5000,
                })
            })
        }
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    renderMenu() {
        let lenguaje = SLanguage.language;
        return <SView col={"xs-11"} height={140} backgroundColor='#000000AA' style={{
            position: "absolute",
            bottom: 8,
            borderRadius: 8,
            padding: 8,
        }} center>
            <SInput
                ref={ref => this.input = ref}
                col={"xs-11"}
                type='text'
                // editable={false}
                required={true}
                defaultValue={this.state.direccion}
                iconR={<SView width={30} center><SIcon name='Search' fill='#fff' width={20} height={20} /></SView>}
                onPress={() => {
                    SPopup.open({
                        key: "autocomplete", content:
                            <PopupAutoCompleteDireccion region={{
                                latitude: -17.783327600000007,
                                longitude: -63.182140799999985,
                                // direccion: "Coronel Ignacio Warnes, Calle 24 de Septiembre, Bartos, Municipio Santa Cruz de la Sierra, Provincia Andrés Ibáñez, Santa Cruz, 3212, Bolivia",
                            }} callback={(resp) => {
                                SPopup.close("autocomplete");
                                this.state.data = resp;
                                console.log(resp)
                                if (this.input) {
                                    this.input.setValue(resp.direccion)
                                }
                                this.state.ready_to_geocode = false;
                                // this.state.region = resp;
                                this.map.animateToRegion({
                                    ...resp,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005
                                }, 1000);

                                // this.state.dirType = "autoComplete"
                                // this.state.nombre = resp.direccion;
                                this.setState({ ...this.state });
                            }} />
                    });
                }}
                // backgroundColor={"#00000000"}
                // backgroundColor={STheme.color.white}
                style={{
                    backgroundColor: STheme.color.primary,
                    color: STheme.color.text,
                }}
                placeholder={(lenguaje == "es") ? "Dirección, Ejemplo: Av Banzer, Santa Cruz" : "Address, Example: Store, Stockton Street, San Francisco,"} />
            <SText height={25} color={STheme.color.danger}>{this.state.error}</SText>
            {/* <SHr height={10} /> */}
            <SButtom type='secondary' onPress={() => {
                // this.input.submit()
                this.state.direccion = this.input.getValue();
                if (!this.state.direccion) {
                    this.setState({ error: (lenguaje == "es") ? "Debes registrar una descripción de dirección." : "You must register a description of the address." });
                    return;
                }
                this.setState({ loading: true, error: "" })
                console.log(this.state)
                if (this.onSelect) this.onSelect(this.state)
            }}><SText color={STheme.color.white} language={{
                es: "REGISTRAR",
                en: "REGISTER"
            }} />
            </SButtom>
        </SView>
    }

    geocode({ latitude, longitude }) {
        return SSocket.sendPromise({
            "version": "1.0",
            "service": "geolocation",
            "component": "locationGoogle",
            "type": "geocode",
            "estado": "cargando",
            "data": {
                "latitude": latitude,
                "longitude": longitude
            },
        })
    }
    render() {
        return <SPage disableScroll>
            <SView col={"xs-12"} height center>
                <SMapView ref={map => this.map = map}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChangeComplete={e => {
                        // Model.locationGoogle.Action.geocode({ latitude: e.latitude, longitude: e.longitude })
                        if (this.state.ready_to_geocode) {
                            this.geocode({ latitude: e.latitude, longitude: e.longitude }).then(e => {
                                const { direccion } = e.data
                                this.input.setValue(direccion);
                            })
                        } else {
                            this.state.ready_to_geocode = true;
                        }

                        this.state.latitude = e.latitude
                        this.state.longitude = e.longitude
                        console.log(e)
                    }}
                >
                    {/* <SMapView.SMarker width={35} height={45} latitude={this.state.latitude} longitude={this.state.longitude} >
                        <SView width={35} height={45} >
                            <SIcon name={"iconMap"} width={35} height={45} />
                        </SView>
                    </SMapView.SMarker> */}

                </SMapView>
                <SView style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    backgroundColor: "#2E52FA66",
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: "#00ff0066"
                }}>

                </SView>
                {this.renderMenu()}
            </SView>
        </SPage>
    }
}
