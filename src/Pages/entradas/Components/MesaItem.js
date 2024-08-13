import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SHr, SIcon, SNavigation, SText, STheme, SView } from 'servisofts-component';

export default class MesaItem extends Component<{ data: any }> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { evento, sector, fecha_evento, key, mesas } = this.props.data;
        return <>
            <SHr height={3} />
            <SView >
                <SIcon name={"card1"} fill={STheme.color.primary} width={110} height={66} style={{
                    position: "absolute",
                    right: 8,
                    top: -8,
                    overflow: "hidden",
                    zIndex: 9999
                }} />
                <SView style={{ position: "absolute", right: 30, top: 8, zIndex: 9999, alignItems: "flex-end" }} flex >
                    <SText fontSize={12} font='OpenSans-Bold' color={STheme.color.secondary}>{new SDate(fecha_evento, "yyyy-MM-ddThh:mm:ss").toString("DAY")}</SText>
                    <SText fontSize={12} font='OpenSans-Bold' color={STheme.color.secondary} >{new SDate(fecha_evento, "yyyy-MM-ddThh:mm:ss").toString("dd de MONTH")}</SText>
                </SView>
            </SView>
            <SView style={{
                width: "100%",
                backgroundColor: STheme.color.card,
                padding: 8,
                borderRadius: 4,
                flexDirection: "row"
            }} onPress={() => {
                SNavigation.navigate("/entradas/mesa", { key_evento: key })
            }}>

                <SView width={55} height center row
                    style={{
                        borderRightWidth: 2,
                        borderColor: STheme.color.card,
                        borderStyle: "dashed"
                    }}>

                    <SIcon
                        name={'Group'}
                        fill={STheme.color.text}
                        height={35}
                        width={35}
                    />
                    <SView width={6} />
                </SView>
                <SView width={8} />
                <SView col={"xs-7"}  >
                    <SHr height={3} />
                    <SText bold>{evento}</SText>
                    <SText fontSize={12}>x {mesas.length}</SText>
                    {/* <SHr />
                    <SView col={"xs-12"} style={{ alignItems: "flex-start" }} row >
                        <SText style={{ textAlign: "left" }} fontSize={12} color={STheme.color.gray}>{new SDate(fecha_evento, "yyyy-MM-ddThh:mm:ss").toString("DAY, dd de MONTH")}</SText>
                    </SView> */}

                </SView>
            </SView>
        </>

    }
}
