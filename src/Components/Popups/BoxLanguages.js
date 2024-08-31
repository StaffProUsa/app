import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SImage, SPage, SText, STheme, SView, SNavigation, SPopup, SLanguage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
export type BoxLanguagesPropsType = {
    datas: any,
    onPress?: (obj) => {},
}
class index extends Component<BoxLanguagesPropsType> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handlePress() {
        if (!this.props.onPress) return null;

        this.props.onPress(this.props.datas)
    }

    renderBox() {
        // var  currentRoute = navigation.getCurrentRoute();
        // var  currentRoute = SNavigation.getCurrentRoute();
        // console.log("currentRoute", currentRoute)
        var INSTACE = this;
        return <SView col={"xs-11 sm-9 md-7 xl-5 xxl-4"} center row withoutFeedback backgroundColor={STheme.color.background}
            style={{
                borderRadius: 20,
                overflow: "hidden",
                borderWidth: 1,
                borderBottomWidth: 2,
                borderColor: "#66666622",
                marginBottom: 50,

            }}
        >
            <SHr height={15} />

            <SView col={"xs-12  "} center row >
                <SView col={"xs-11"} row center>

                    <SView col={"xs-12"} height={48} center row
                        style={{
                            borderBottomColor: STheme.color.gray,
                            borderBottomWidth: 1
                        }}
                        onPress={() => {
                            SLanguage.change("en")
                            SPopup.close("menuLat")
                        }}
                    >
                        <SView col={"xs-4.5"} />
                        <SView col={"xs-4.5"} row >
                            <SImage src={require("../../Assets/images/en.png")} style={{ height: 28, width: 28 }} />
                            <SView width={10} />
                            <SText fontSize={14} language={{
                                es: "Inglés",
                                en: "English"
                            }} center />
                        </SView>
                        <SView col={"xs-3"}>
                            {SLanguage.language == "en" ? <SIcon name='select' height={20} width={20} /> : null}

                        </SView>

                        <SView width={15} />
                    </SView>
                    <SView col={"xs-12"} height={48} center row
                        onPress={() => {
                            SLanguage.change("es")
                            SPopup.close("menuLat")
                        }}
                    >
                        <SView col={"xs-4.5"} />
                        <SView col={"xs-4.5"} row >
                            <SImage src={require("../../Assets/images/es.png")} style={{ height: 28, width: 28 }} />
                            <SView width={10} />
                            <SText fontSize={14} language={{
                                es: "Español",
                                en: "Spanish"
                            }} center />
                        </SView>
                        <SView col={"xs-3"}>
                            {SLanguage.language == "es" ? <SIcon name='select' height={20} width={20} /> : null}
                        </SView>
                    </SView>

                    <SHr height={15} />
                </SView>
            </SView>
            <SView flex />
        </SView>
    }

    render() {
        return (<SView col={"xs-12"} center>
            {/* <SText>{JSON.stringify(this.props.data)}</SText> */}
            {this.renderBox()}
            <SHr h={8} />
        </SView >
        );
    }
}
export default (index);