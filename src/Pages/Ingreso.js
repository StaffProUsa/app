import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SImage, SNavigation, SPage, SText, SView } from 'servisofts-component';
import { Container } from '../Components';

export default class Ingreso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: "select user"
        };
    }

    getOption({ key, title, icon, url }) {
        return <SView col={"xs-12"} height={180} center row
            style={{
                borderRadius: 15,
                overflow: "hidden"
            }}
            onPress={() => {
                SNavigation.navigate(url);
            }}>
            <SGradient colors={["#B8191A", "#520B0C"]} />
            <SView col={"xs-3"} height center
                style={{
                    backgroundColor: "#07070A",
                    borderBottomRightRadius: 100,
                    borderTopRightRadius: 100,
                    padding: 10
                }}>
                <SIcon name={icon} height={65} />
            </SView>
            <SView col={"xs-9"} height center>
                <SText fontSize={38} bold>{title}</SText>
            </SView>
        </SView>
    }


    render() {

        return <SPage title={"Ingresando"} disableScroll center>
            <Container>
                <SText fontSize={28} bold>What are you?</SText>
                <SHr height={35} />
                {this.getOption({
                    key: '/',
                    title: 'Company',
                    icon: 'company',
                    url: '/inicio',
                })}
                <SHr height={35} />
                {this.getOption({
                    key: '/',
                    title: 'Staff',
                    icon: 'staff',
                    url: '/inicio',
                })}
                {/* <SView col={"xs-12"} height={180} center row
                    style={{
                        borderRadius: 15,
                        overflow: "hidden"
                    }}>
                    <SGradient colors={["#B8191A", "#520B0C"]} />
                    <SView col={"xs-3"} height center
                        style={{
                            backgroundColor: "#07070A",
                            borderBottomRightRadius: 100,
                            borderTopRightRadius: 100,
                            padding: 10
                        }}>
                        <SIcon name={"company"} height={75} />
                    </SView>
                    <SView col={"xs-9"} height center>
                        <SText fontSize={38} bold>Company</SText>
                    </SView>
                </SView> */}
            </Container>
        </SPage>
    }
}
