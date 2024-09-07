import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SPage, SText } from 'servisofts-component';
import PBarraFooter from '../../Components/PBarraFooter';
import { Container } from '../../Components';

export default class exito extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return <SPage footer={<PBarraFooter url={'/token/exito'} />} disableScroll>
            <Container flex>
                <SText fontSize={18}>{"EXITO AL MARCAR"}</SText>
            </Container>
        </SPage>
    }
}
