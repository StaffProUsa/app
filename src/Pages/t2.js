import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SImage, SNavigation, SPage, SText, SView } from 'servisofts-component';
import { Container } from '../Components';

export default class t2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: "select user"
        };
    }


    render() {

        const fecha_quellega = "2024-01-01T22:30:49.003"
        return <SPage title={"Test"} disableScroll >
            <SText>{new SDate(fecha_quellega, "yyyy-MM-ddThh:mm:ss").toString("DAY dd de MONTH de año yyyy a las HH")}</SText>
            <SText>{new SDate().toString("DAY dd de MONTH de año yyyy a las HH")}</SText>
            <SView width={400} height={400}>
                <SImage enablePreview  src={require("../Assets/images/evento1.jpg")}/>
            </SView>
            <SView col={"xs-12"} height center>
                <SView padding={8} style={{
                    position: "absolute",
                    width: 100,
                    height: 100,
                    // backgroundColor: "#f00",
                    borderWidth: 1,
                    borderColor: "#ff0",
                    borderRadius: 100,
                    overflow: 'hidden',
                    justifyContent: "center",
                    alignItems: "center",
                    // transform: [{ translateX: -10 }, { rotateX: "99deg" }]
                    // top:100
                }} onPress={() => {
                    SNavigation.navigate("/usuario", {
                        onSelect: (obj) => {
                            this.setState({ label: obj.Nombres })
                            // alert("Se selecciono al usuario "+ obj.Nombres)
                        }
                    })
                }}>
                    <SGradient colors={["#ff0", "#f0f"]} />
                    <SText fontSize={16} bold underLine font='Montserrat'>{this.state.label}</SText>
                </SView>
            </SView>
        </SPage>
    }
}
