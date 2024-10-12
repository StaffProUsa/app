import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon } from 'servisofts-component';
import { AccentBar } from '../../Components';
import Container from '../../Components/Container';
import Model from '../../Model';
// import SectionApis from '../login/components/SectionApis';
import BtnSend from './components/BtnSend';
import Header from './components/Header';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';

class genero extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envio: 0
        };
        this.params = SNavigation.getAllParams();
    }
    icon = (name) => {
        return <SIcon
            name={name}
            fill={STheme.color.primary}
            width={17}
            height={20}
        />
    }
    render() {
        var defaultData = {
            ...this.params,
        };
        return (
            <SPage footer={<SView col={'xs-12'} row center>
                <SView col={'xs-11'} row>
                    <SView col={'xs-6'} >
                        <SView onPress={() => {
                            SNavigation.goBack()
                        }}
                            style={{
                                backgroundColor: STheme.color.secondary,
                                borderRadius: 10,
                            }} width={80} height={50} center>
                            <SText color={STheme.color.text} fontSize={16}>Atrás</SText>
                        </SView>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: "flex-end" }}>
                        <SView onPress={() =>  SNavigation.navigate("/registro/foto")}>
                            <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
                        </SView>
                    </SView>
                </SView>
                <SHr height={20} />
            </SView>}
            >
                <SView col={"xs-12"} center>
                    <SView col={"xs-11"} >
                        <SIcon name={"Logo"} fill={STheme.color.primary} width={80} height={43} />
                        <SHr height={10} />
                    </SView>
                    <Header title="What is your gender?" />
                    <SHr height={40} />
                    <Container>

                        <SView col={"xs-12"} center>
                            <SView width={130} height={130} center style={{
                                backgroundColor: STheme.color.blue,
                                borderRadius: 100,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}>
                                <SIcon name={"man"} fill={STheme.color.text} width={48} height={48} />
                                <SText fontSize={16} center >Man</SText>
                            </SView>
                            <SHr height={20} />
                            <SView width={130} height={130} center style={{
                                backgroundColor: '#DA2060',
                                borderRadius: 100,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}>
                                <SIcon name={"man"} fill={STheme.color.text} width={48} height={48} />
                                <SText fontSize={16} center >Women</SText>
                            </SView>
                        </SView>

                        <SHr height={30} />



                        {/* <PButtom onPress={() => this.form.submit()}>{"Registrar"}</PButtom> */}

                        <SHr height={30} />
                        {/* <SectionApis /> */}
                    </Container>
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(genero);