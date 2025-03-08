import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SImage, SPage, SText, STheme, SView, SNavigation, SPopup, SLanguage, SList2, SButtom, SInput } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
export type BoxMenuPropsType = {
    data: any,
    onPress?: (obj) => {},
}
class index extends Component<BoxMenuPropsType> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handlePress() {
        if (!this.props.onPress) return null;

        this.props.onPress(this.props.datas)
    }


    renderOption = ({ label, icon, url, params }) => {

        // renderOption = (label: string) => {
        return (
            <>
                <SView col={"xs-11"} row center
                    onPress={() => {
                        SNavigation.navigate(url, params)

                        SPopup.close("popup_menu_alvaro");
                    }}


                >
                    <SView col={"xs-2"} center height={32}>
                        <SIcon name={icon} height={18} fill={STheme.color.card} />
                    </SView>
                    <SView flex  >
                        <SText fontSize={14} bold>{label}</SText>
                    </SView>

                </SView>
                <SHr height={1} color={STheme.color.card} />
            </>
        );
    }

    renderBox() {

        // console.log("this.props.data", this.props.data)
        const options = [
            { label: SLanguage.select({ en: "See company", es: "Ver compania" }), icon: "Eyes", url: "/company/profile", params: { pk: this.props.data.company.key } },
            { label: SLanguage.select({ en: "See client", es: "Ver cliente" }), icon: "Eyes", url: "/cliente/profile", params: { pk: this.props.data.cliente.key } },
            { label: SLanguage.select({ en: "See event", es: "Ver evento" }), icon: "Eyes", url: "/company/event", params: { key_evento: this.props.data.evento.key } },
            { label: SLanguage.select({ en: "See booking", es: "Ver booking" }), icon: "Eyes", url: "/staff/users", params: { pk: this.props.data.staff.key } },
            {
                label: SLanguage.select({ en: "See timeSheet", es: "Ver timeSheet" }), icon: "Eyes", url: "/company/timeSheets", params: {
                    key_company: this.props.data.company.key,
                    key_cliente: this.props.data.cliente.key,
                    key_evento: this.props.data.evento.key
                }
            },
        ];

        return (
            <SView
                col={"xs-12"}
                center
                row
                withoutFeedback
                backgroundColor={STheme.color.background}
                style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    borderWidth: 1,
                    //  borderBottomWidth: 2,
                    borderColor: "#66666699",
                }}
            >
                <SView col={"xs-12"} row center  >
                    {options.map(this.renderOption)}
                </SView>
            </SView>
        );
    }

    render() {
        return (<SView col={"xs-12"} flex center >
            {/* <SText>{JSON.stringify(this.props.data)}</SText> */}
            {this.renderBox()}
            {/* <SHr h={8} /> */}
        </SView >
        );
    }
}
export default (index);