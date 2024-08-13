import React, { Component } from 'react';
import { SButtom, SPage, SText, SView } from 'servisofts-component';
import { LoginType } from "../types";
import AppleLogin from "react-apple-login"

class LoginApple extends Component<LoginType> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    appleResponse = (e) => {
        console.log(e);
    }
    render() {
        return <AppleLogin
            clientId="com.servisofts.casagrande"
            redirectURI="https://ricky.servisofts.com/"
            usePopup={true}
            callback={this.appleResponse} // Catch the response
            // scope="email name"
            // responseMode="query"
            render={renderProps => (  //Custom Apple Sign in Button
                <SView onPress={renderProps.onClick}>
                    {this.props.children}
                </SView>
            )}
        />
        return <SView>
            {this.props.children}
        </SView>
    }
}

export default LoginApple;