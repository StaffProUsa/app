import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SForm, SHr, SIcon, SImage, SInput, SNavigation, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component';
import Model from '../../Model';
import CryptoJS from 'crypto-js';

class intro3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.ruta = SNavigation.getParam('ruta');
        console.log(this.ruta);
    }
    componentDidMount() {
        new SThread(100, "espera").start(() => {
            this.setState({ ready: true })
        })
    }

    render() {
        if (Model.usuario.Action.getUsuarioLog()) {
            SNavigation.goBack();
            return null;
        }

        return (
            <SPage title={''} hidden footer={<SView col={'xs-12'} style={{ alignItems: 'flex-end', position: "absolute", bottom: 25, right: 25, }} >
                <SText fontSize={30} center bold color={STheme.color.primary}>Jobs with a variety</SText>
                <SText fontSize={30} center bold color={STheme.color.primary}>of schedules</SText>
                <SHr height={25} />
                <SView col={'xs-12'} row>
                    <SView col={'xs-6'} style={{left:50}}>
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
                    <SView col={'xs-6'} style={{alignItems: 'flex-end'}}>
                        <SView onPress={() => {
                            SNavigation.navigate('carga')
                        }}>
                            <SIcon name={'next'} fill={STheme.color.primary} style={{ width: 50, height: 50 }} />
                        </SView>
                    </SView>
                </SView>

            </SView>} >
                <SView col={'xs-12'} height
                    style={{
                        zIndex: 9999,
                        position: "relative",
                        backgroundColor: "#B8191A90",
                    }}>
                    <SHr height={25} />
                    <SView col={'xs-12'} style={{ alignItems: 'flex-start', top: 25, left: 25, position: "absolute" }}>
                        <SIcon name={'Logo'} fill={STheme.color.primary} style={{ width: 150 }} />
                    </SView>
                </SView>
                <SImage src={require('../../Assets/images/intro3.jpg')} style={{ resizeMode: "cover", zIndex: 9, position: "absolute" }} />
            </SPage >
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(intro3);