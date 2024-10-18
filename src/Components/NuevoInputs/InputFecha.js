import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SImage, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import InputSelect from './InputSelect';

export default class InputFecha extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: "select user",
            ano: new SDate().getYear(),
            mes: new SDate().getMonth(),
            dia: new SDate().getDay(),
        };
    }


    render() {
        const monthArray = Object.values(SDate.getMonthsOfYear()).map(a => a.text)
        const selectdate = new SDate(this.state.ano + "-" + (this.state.mes) + "-" + "01", "yyyy-MM-dd");
        selectdate.addDay(this.state.dia - 1)
        return <SView row>
            <SText padding={4} card onPress={() => {
                SPopup.open({
                    key: "mipopup",
                    type: "2",
                    content: <SView col={"xs-12"} height backgroundColor={STheme.color.background}>
                        <InputSelect
                            data={monthArray}
                            defaultValue={monthArray[this.state.mes - 1]}
                            onChange={(e) => {
                                const index = monthArray.findIndex(a => a == e)
                                this.state.mes = (index + 1);
                            }}
                        />
                        <SView style={{ width: "100%", height: 80, bottom: 0, position: "absolute", backgroundColor: STheme.color.secondary }} center onPress={() => {
                            SPopup.close("mipopup")
                            this.setState({ ...this.state })
                        }}>
                            <SText color={STheme.color.primary}>{"ACEPTAR"}</SText>
                        </SView>
                    </SView>
                })
            }} >{monthArray[this.state.mes - 1]}</SText>
            <SView width={4} />
            <SText padding={4} card onPress={() => {
                const date = new SDate(this.state.ano + "-" + (this.state.mes) + "-01", "yyyy-MM-dd");
                date.addDay(-1);
                const startYear = 1
                const endYear = date.getDay();
                console.log(date, startYear, endYear)
                const array = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
                // const maxday = date.getDay();
                SPopup.open({
                    key: "mipopup",
                    type: "2",
                    content: <SView col={"xs-12"} height backgroundColor={STheme.color.background}>
                        <InputSelect
                            data={array}
                            defaultValue={this.state.dia}
                            onChange={(e) => {
                                const index = array.findIndex(a => a == e)
                                this.state.dia = (index + 1);
                            }}
                        />
                        <SView style={{ width: "100%", height: 80, bottom: 0, position: "absolute", backgroundColor: STheme.color.secondary }} center onPress={() => {
                            SPopup.close("mipopup")
                            this.setState({ ...this.state })
                        }}>
                            <SText color={STheme.color.primary}>{"ACEPTAR"}</SText>
                        </SView>
                    </SView>
                })
            }} >{selectdate.getDayOfWeekJson().text} {this.state.dia},</SText>
            <SView width={8} />
            <SText padding={4} card onPress={() => {
                const startYear = new SDate().getYear();
                const endYear = startYear + 20;
                const yearsArray = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
                SPopup.open({
                    key: "mipopup",
                    type: "2",
                    content: <SView col={"xs-12"} height backgroundColor={STheme.color.background} withoutFeedback>
                        <InputSelect
                            data={yearsArray}
                            defaultValue={this.state.ano}
                            onChange={(e) => {
                                this.state.ano = e;
                            }}
                        />
                        <SView style={{ width: "100%", height: 80, bottom: 0, position: "absolute", backgroundColor: STheme.color.secondary }} center onPress={() => {
                            SPopup.close("mipopup")
                            this.setState({ ...this.state })
                        }}>
                            <SText color={STheme.color.primary}>{"ACEPTAR"}</SText>
                        </SView>
                    </SView>
                })
            }} >{this.state.ano}</SText>
        </SView>
    }
}
