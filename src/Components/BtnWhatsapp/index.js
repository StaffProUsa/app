import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Linking, Platform } from 'react-native'
import { SPage, SText, SView } from 'servisofts-component';

export type BtnWhatsappPropsType = {
    latLng: {
        latitude: any,
        longitude: any
    }
}
export default class index extends Component<BtnWhatsappPropsType> {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.telefono = this.props.telefono.replace(/[+\s]/g, '');
        this.telefono = this.telefono.replace(/[(|)|-]/g, '');
        // this.telefono = this.telefono.replace(/[\s]/g, '');
        
    }

    _handle_ios() {
        Linking.openURL('https://wa.me/');
    }
    _handle_android() {
        Linking.openURL(`https://wa.me/${this.telefono}?text=${this.props.texto}`);
    }
    _handle_web() {
        console.log(this.telefono)
        Linking.openURL(`https://wa.me/${this.telefono}?text=${this.props.texto}`);
        // Linking.openURL(`https://api.whatsapp.com/send?phone=${this.telefono}`);
    }
    _handlePress() {
        Platform.select({
            ios: this._handle_ios.bind(this),
            android: this._handle_android.bind(this),
            default: this._handle_web.bind(this),
        })();
    }
    render() {
        return (
            <SView onPress={this._handlePress.bind(this)} {...this.props}>
                {this.props.children ?? <SText>Navegar</SText>}
            </SView>
        );
    }
}