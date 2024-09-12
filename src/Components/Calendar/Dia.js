import React, { Component } from 'react';
import { SHr, SIcon, SText, STheme, SView } from 'servisofts-component';

export default class Dia extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <SView col={"xs-1.7"}  center backgroundColor={"#8B8B8B"} height={35}
            style={{borderWidth: 1, borderColor: STheme.color.lightGray}}
            >
                <SText color={STheme.color.white} font="Oswald-Bold" fontSize={14}>{this.props.dia}</SText>
            </SView>
        );
    }
}
