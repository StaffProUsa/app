import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

export default class factura extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
        this.handlePress();
    }
    handlePress = () => {
        SPDF.create(<SPDF.Page style={{ width: 612, height: 791, margin: 20, padding: 20, borderWidth: 1, }} >
            <SPDF.View style={{ width: "100%", height: 4 }}></SPDF.View>
            <SPDF.Text style={{ fontWeight: "bold", width: "100%" }}>{"Gola como estas"}</SPDF.Text>
            <SPDF.View style={{ width: "100%", height: 4 }}></SPDF.View>
            <SPDF.Text style={{ width: "100%" }}>{"Como estas"}</SPDF.Text>
            <SPDF.View style={{ width: "100%", height: 8 }}></SPDF.View>
            <SPDF.View style={{ backgroundColor: "#000000", width: "100%", height: 1 }}></SPDF.View>
            <SPDF.View style={{ width: "100%", height: 8 }}></SPDF.View>
            <SPDF.View style={{ width: "100%", height: 30, backgroundColor: "#71AF4A", alignItems: "center", justifyContent: "center" }}>
                <SPDF.Text>{"asdasdasd"}</SPDF.Text>
            </SPDF.View>
            <SPDF.View style={{ width: "100%", height: 8 }}></SPDF.View>
            <SPDF.View style={{ backgroundColor: "#000000", width: "100%", height: 1 }}></SPDF.View>
            <SPDF.View style={{ width: "100%", height: 8 }}></SPDF.View>
            <SPDF.View style={{ width: "100%", height: 8 }}></SPDF.View>
        </SPDF.Page >)
    }

    render() {
        return <SView onPress={this.handlePress.bind(this)}>
            <Text> Export PDF </Text>
        </SView>
    }
}
