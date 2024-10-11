import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SGeolocation, SHr, SInput, SMapView, SNavigation, SNotification, SPage, SText, STheme, SView, SLanguage } from 'servisofts-component';

export default class select extends Component {
    map: SMapView;
    constructor(props) {
        super(props);
        this.state = {
            latitude: SNavigation.getParam("latitude"),
            longitude: SNavigation.getParam("longitude"),
            direccion: SNavigation.getParam("direccion")
        };
        this.onSelect = SNavigation.getParam("onSelect")
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        if (this.state.latitude || this.state.longitude) {
            this.map.animateToRegion({ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 })
        } else {
            SGeolocation.getCurrentPosition({

            }).then(e => {
                this.map.animateToRegion({ latitude: e.coords.latitude, longitude: e.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 })
            }).catch(e => {
                SNotification.send({
                    title: "Error",
                    body: "No pudimos optener tu ubicacion",
                    color: STheme.color.danger
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
                required={true}
                defaultValue={this.state.direccion}
                backgroundColor={"#00000000"}
                // style={{
                //     backgroundColor: STheme.color.card
                // }}
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
            }}><SText language={{
                es: "REGISTRAR",
                en: "REGISTER"
            }} />
            </SButtom>
        </SView>
    }

    render() {
        return <SPage disableScroll>
            <SView col={"xs-12"} height center>
                <SMapView ref={map => this.map = map}
                    onRegionChangeComplete={e => {
                        this.state.latitude = e.latitude
                        this.state.longitude = e.longitude
                    }}>
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
