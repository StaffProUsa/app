import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SForm, SHr, SIcon, SImage, SInput, SNavigation, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component';
import Model from '../../Model';
import CryptoJS from 'crypto-js';

class root extends Component {
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
        // if (Model.usuario.Action.getUsuarioLog()) {
        //     SNavigation.goBack();
        //     return null;
        // }

        return (
            <SPage title={''} hidden footer={<SView col={'xs-12'} style={{ alignItems: 'flex-end',position:"absolute", bottom:25,right:25, }} >
                <SText fontSize={30} center bold color={STheme.color.primary}>A celebration of</SText>
                <SText fontSize={30} center bold color={STheme.color.primary}>flavors</SText>
                <SHr height={25} />
                <SView  onPress={()=>{
                    SNavigation.navigate('/intro/dos')
                }}>
                    <SIcon name={'next'} fill={STheme.color.primary} style={{ width: 50, height:50 }} />
                </SView>
            </SView>} >
                <SView col={'xs-12'} height
                    style={{
                        zIndex: 9999,
                        position: "relative",
                        backgroundColor: "#B8191A90",
                    }}>
                        <SHr height={25} />
                        <SView col={'xs-12'} style={{ alignItems: 'flex-end', top: 25, right:25, position: "absolute" }}>
                            <SIcon name={'Logo'} fill={STheme.color.primary} style={{ width: 150 }} />
                        </SView>
                </SView>
                <SImage src={require('../../Assets/images/intro1.jpg')} style={{ resizeMode: "cover", zIndex: 9, position: "absolute" }} />
            </SPage >
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);