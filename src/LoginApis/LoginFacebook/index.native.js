import React, { Component } from 'react';
import { SView } from 'servisofts-component';
import {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk';

import { LoginType } from "../types";

class LoginFacebook extends Component<LoginType> {



    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }
    getInfoFromToken = token => {
        const PROFILE_REQUEST_PARAMS = {
            fields: {
                string: 'id, name,  first_name, last_name, email',
            },
        };
        const profileRequest = new GraphRequest(
            '/me',
            { token, parameters: PROFILE_REQUEST_PARAMS },
            (error, result) => {
                if (error) {
                    console.log('login info has error: ' + error);
                } else {
                    if (this.props.onLogin) {
                        this.props.onLogin(result);
                    }
                    console.log('result:', result);
                }
            },
        );
        new GraphRequestManager().addRequest(profileRequest).start();
    };
    signIn = async () => {
        LoginManager.logInWithPermissions(['public_profile']).then(
            login => {
                if (login.isCancelled) {
                    console.log('Login cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        const accessToken = data.accessToken.toString();
                        this.getInfoFromToken(accessToken);
                    });
                }
            },
            error => {
                console.log('Login fail with error: ' + error);
            },
        );
    };
    render() {
        return (
            <SView onPress={this.signIn}>
                {this.props.children}
            </SView>
        );
    }
}

export default LoginFacebook;