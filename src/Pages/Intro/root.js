import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SForm, SHr, SIcon, SImage, SInput, SNavigation, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component';
import Model from '../../Model';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';
import LoginFacebook from '../../LoginApis/LoginFacebook';
import LoginGoogle from '../../LoginApis/LoginGoogle';
import LoginApple from '../../LoginApis/LoginApple';
import PBarraFooter from '../../Components/PBarraFooter';
import { Container } from '../../Components';

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
        if (Model.usuario.Action.getUsuarioLog()) {
            SNavigation.goBack();
            // SNavigation.navigate("/login");
            return null;
        }

        // if (!this.state.ready) return this.renderHeader();
        return (
            <SPage title={''} hidden  >

                <SView col={'xs-12'} height
                    style={{
                        zIndex: 9999,
                        position: "relative",
                        backgroundColor:"#B8191A40",
                    }}>
                    <Container >
                        <SHr height={25} />
                        <SView col={'xs-12'} style={{ alignItems: 'flex-end' }}>
                            <SIcon name={'Logo'} fill={STheme.color.primary} style={{ width: 150 }} />
                        </SView>
                    </Container>
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