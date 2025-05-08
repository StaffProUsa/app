import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

export default class test extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
        this.handlePress();
    }
    handlePress = () => {
        SPDF.create(<SPDF.Page style={{ width: 300, height: 791, margin: 20, padding: 20, borderWidth: 1, }} >
            <SPDF.View style={{ width: "100%", height: 4 }}></SPDF.View>
            <SPDF.Text style={{ fontWeight: "bold", width: "100%" }}>{"Gola como estas kas dka dkas dkas daksd akd akd akasdk askd askd ask ds kad sakd akdk as"}</SPDF.Text>
            <SPDF.View style={{ width: "100%", height: 4 }}></SPDF.View>
    
        </SPDF.Page >)
    }

    render() {
        return <SView onPress={this.handlePress.bind(this)}>
            <Text> Export PDF </Text>
        </SView>
    }
}
