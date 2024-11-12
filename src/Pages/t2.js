import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SImage, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import { Container } from '../Components';
import InputFecha from '../Components/NuevoInputs/InputFecha';
import InputFloat from '../Components/NuevoInputs/InputFloat';
import InputSelect from '../Components/NuevoInputs/InputSelect';
import InputHora from '../Components/NuevoInputs/InputHora';

export default class t2 extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    handlePress(e) {
        InputFloat.open({
            e: e,
            width: 100,
            height: 200,
            style: {
                backgroundColor: "#f0f"
            },
            render: () => {
                return <SText>{"Hola"}</SText>
            }
        });
    }

    render() {
        return <SPage title={"Test"} disableScroll>
            <Container >
                <SText onPress={() => {
                    // const a = "2024-11-09T02:11:36.000204-04:00";
                    const a = "2024-11-09T04:07:05.657-04:00";
                    const data = new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD")
                    console.log(data);
                }}>TEST</SText>
                {/* <SHr />
                <InputFecha />
                <SHr />
                <SText onPress={(evt) => {
                    InputFloat.open({
                        e: evt,
                        width: 120, height: 160,
                        style: {
                            backgroundColor: STheme.color.secondary,
                            borderRadius: 4
                        },
                        render: () => {
                            return <InputHora />
                        }
                    });
                }}>{"Liceht"}</SText> */}
            </Container>

        </SPage>
    }
}
