import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SIcon, SImage, STheme, SView, SLanguage } from 'servisofts-component'
import Model from '../../Model'
import SSocket from 'servisofts-socket';


export default class RContent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onChangeLanguage(language) {
        this.setState({...this.state})
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }
    render() {
        return (
            <SView col={"xs-12"} height center
                style={{
                    borderWidth: 0,
                    overflow: "hidden",
                    alignItems: "flex-end",
                    padding: 5,
                }} >
                {SLanguage.language == "es" ? <SImage src={require("../../Assets/images/es.png")} style={{ height: 33, with: 33 }} /> : <SImage src={require("../../Assets/images/en.png")} style={{ height: 33, with: 33 }} />}
            </SView>
        )
    }
}