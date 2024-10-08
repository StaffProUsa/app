import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SGeolocation, SHr, SInput, SMapView, SNavigation, SNotification, SPage, SText, STheme, SView } from 'servisofts-component';

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
    componentDidMount() {
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

    renderMenu() {
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
                defaultValue={this.state.direccion}
                backgroundColor={"#00000000"}
                // style={{
                //     backgroundColor: STheme.color.card
                // }}
                placeholder={"Direccion, Ejemplo. Av Banzer, Santa Cruz"} />
            <SHr />
            <SButtom type='danger' onPress={() => {
                this.state.direccion = this.input.getValue();
                console.log(this.state)
                if (this.onSelect) this.onSelect(this.state)
            }}>SUBIR</SButtom>
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
