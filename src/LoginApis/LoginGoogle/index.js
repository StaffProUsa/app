import React, { Component } from 'react';
import { SButtom, SPage, SText, SView } from 'servisofts-component';
// import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { LoginType } from "../types";
import { GoogleOAuthProvider, hasGrantedAllScopesGoogle, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';

class LoginGoogle extends Component<LoginType> {
    constructor(props) {
        super(props);
        this.state = {
            clientId: "41727723156-s6f9s6sab8aa4d1j8afft3qoggcvl38i.apps.googleusercontent.com"
        };
    }

    render() {
        return <>
            <GoogleOAuthProvider clientId={this.state.clientId}>
                <Item {...this.props} />
            </GoogleOAuthProvider>
        </>
    }
}
const Item = ({ onLogin, children }) => {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                }
            }).then(e => e.json())
                .then(e => {
                    console.log(e);
                    if (onLogin) {
                        onLogin({
                            id: e.sub,
                            email: e.email,
                            name: e.given_name,
                            last_name: e.family_name
                        })
                    }
                }).catch(e => {
                    console.log(e);
                })
        },
    });
    return <SView onPress={() => {
        login();
    }}>{children}</SView>
}
export default LoginGoogle