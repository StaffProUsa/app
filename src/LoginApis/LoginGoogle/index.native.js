import React, { Component } from 'react';
import { SView } from 'servisofts-component';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LoginType } from "../types";
GoogleSignin.configure({
    webClientId: "41727723156-2agopvqm5d52plh8vtfth1818p4o61fg.apps.googleusercontent.com"
});

class LoginGoogle extends Component<LoginType> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    signIn = async () => {
        try {

            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.setState({ userInfo });
            GoogleSignin.signOut();
            console.log(userInfo);
            if (userInfo.user) {
                if (this.props.onLogin) {

                    this.props.onLogin({
                        email: userInfo.user.email,
                        id: userInfo.user.id,
                        name: userInfo.user.givenName,
                        last_name: userInfo.user.familyName
                    });
                }
            }
        } catch (error) {
            console.error(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            } else if (error.code === statusCodes.IN_PROGRESS) {
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            } else {
            }
        }
    };
    render() {
        return (
            <SView onPress={this.signIn}>
                {this.props.children}
            </SView>
        );
    }
}

export default LoginGoogle;