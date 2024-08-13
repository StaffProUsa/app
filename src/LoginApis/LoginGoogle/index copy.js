import React, { Component } from 'react';
import { SButtom, SPage, SText, SView } from 'servisofts-component';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { LoginType } from "../types";
class LoginGoogle extends Component<LoginType> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const responseGoogle = (response) => {
            console.log(response);
            if (response.googleId) {
                if (this.props.onLogin) {
                    this.props.onLogin({
                        id: response?.profileObj?.googleId,
                        email: response.profileObj.email,
                        name: response.profileObj.givenName,
                        last_name: response.profileObj.familyName
                    });
                }
            }
        }
        return <>
            <GoogleLogin
                clientId="41727723156-s6f9s6sab8aa4d1j8afft3qoggcvl38i.apps.googleusercontent.com"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                onScriptLoadFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => {
                    return (
                        <SView onPress={renderProps.onClick}>{this.props.children}</SView>
                    );
                }}
            >
            </GoogleLogin>
        </>
    }
}

export default LoginGoogle;