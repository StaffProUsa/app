import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SImage, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import { Container } from '../Components';
import InputFecha from '../Components/NuevoInputs/InputFecha';

export default class t2 extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {
        return <SPage title={"Test"}  >
            <Container>
                <InputFecha />
            </Container>
        </SPage>
    }
}
