import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SDate, SIcon, SLoad, SPage, SText, STheme, SThread, SView, SNavigation, SImage, SLanguage, SGradient, SHr } from 'servisofts-component';

import Model from '../../../Model';
import SSocket from 'servisofts-socket';

class BtnAsistencia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curtime: new SDate()
        };
    }

    componentDidMount() {
        this.state.run = true;
    }
    componentWillUnmount() {
        this.state.run = false;
    }
 


    render() {

        return (
            <SView col={'xs-12'} backgroundColor={STheme.color.secondary} style={{ borderRadius: 14, overflow: "hidden" }} padding={15} row center
            onPress={this.props.onPress}
            >
                <SIcon name={"start"} width={80} height={80} />
                <SView width={15} />
                <SText fontSize={34} language={{
                    es: "Iniciar Trabajo",
                    en: "Start Work"
                  }}/>
            </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(BtnAsistencia);