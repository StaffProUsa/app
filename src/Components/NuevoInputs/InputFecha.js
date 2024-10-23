import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SHr, SIcon, SImage, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import InputSelect from './InputSelect';
import InputFloat from './InputFloat';

export default class InputFecha extends Component {
    constructor(props) {
        super(props);
        const cd = new SDate(props.defaultValue ?? new SDate().toString("yyyy-MM-dd"), "yyyy-MM-dd")
        this.state = {
            label: "select user",
            ano: cd.getYear(),
            mes: cd.getMonth(),
            dia: cd.getDay(),
        };
    }

    getValue() {
        let mes = "";
        if (this.state.mes < 10) {
            mes = "0" + this.state.mes
        } else {
            mes = this.state.mes
        }
        const selectdate = new SDate(this.state.ano + "-" + (mes) + "-" + "01", "yyyy-MM-dd");
        // console.log(selectdate.clone().addMonth(1).addDay(-1).getDay());
        if (selectdate.clone().addMonth(1).addDay(-1).getDay() < (this.state.dia)) {
            this.state.dia = parseFloat(selectdate.clone().addMonth(1).addDay(-1).getDay());
        }
        selectdate.addDay(this.state.dia - 1)

        return selectdate.toString("yyyy-MM-dd")
    }
    setValue(fecha) {
        const cd = new SDate(fecha ?? new SDate().toString("yyyy-MM-dd"), "yyyy-MM-dd")
        this.state = {
            label: "select user",
            ano: cd.getYear(),
            mes: cd.getMonth(),
            dia: cd.getDay(),
        };
        this.setState({...this.state})
    }
    render() {
        const monthArray = Object.values(SDate.getMonthsOfYear()).map(a => a.text)
        console.log(this.state)
        let mes = "";
        if (this.state.mes < 10) {
            mes = "0" + this.state.mes
        } else {
            mes = this.state.mes
        }
        const selectdate = new SDate(this.state.ano + "-" + (mes) + "-" + "01", "yyyy-MM-dd");
        // console.log(selectdate.clone().addMonth(1).addDay(-1).getDay());
        if (selectdate.clone().addMonth(1).addDay(-1).getDay() < (this.state.dia)) {
            this.state.dia = parseFloat(selectdate.clone().addMonth(1).addDay(-1).getDay());
        }
        selectdate.addDay(this.state.dia - 1)
        return <SView row>
            <SText padding={6} card onPress={(e) => {
                InputFloat.open({
                    e: e,
                    width: 100,
                    height: 100,
                    style: {
                        backgroundColor: STheme.color.background
                    },
                    render: () => {
                        return <SView col={"xs-12"} height card>
                            <InputSelect
                                data={monthArray}
                                ITEM_HEIGHT={25}
                                defaultValue={monthArray[this.state.mes - 1]}
                                onChange={(e) => {
                                    const index = monthArray.findIndex(a => a == e)
                                    this.state.mes = (index + 1);
                                    this.setState({ ...this.state })
                                }}
                            />
                            {/* <SView style={{ width: "100%", height: 80, bottom: 0, position: "absolute", backgroundColor: STheme.color.secondary }} center onPress={() => {
                                SPopup.close("mipopup")
                                this.setState({ ...this.state })
                            }}>
                                <SText color={STheme.color.primary}>{"ACEPTAR"}</SText>
                            </SView> */}
                        </SView>
                    }
                })
            }} >{monthArray[this.state.mes - 1]}</SText>
            <SView width={4} />
            <SText padding={6} card onPress={(e) => {
                let mes = "";
                if (this.state.mes < 10) {
                    mes = "0" + this.state.mes
                } else {
                    mes = this.state.mes
                }
                const date = new SDate(this.state.ano + "-" + (this.state.mes) + "-01", "yyyy-MM-dd");
                date.addDay(-1);
                const startYear = 1
                const endYear = date.getDay();
                console.log(date, startYear, endYear)
                const array = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
                // const maxday = date.getDay();
                InputFloat.open({
                    e: e,
                    width: 100,
                    height: 100,
                    style: {
                        backgroundColor: STheme.color.background
                    },
                    render: () => {
                        return <SView col={"xs-12"} height card>
                            <InputSelect
                                data={array}
                                ITEM_HEIGHT={25}
                                defaultValue={this.state.dia}
                                onChange={(e) => {
                                    const index = array.findIndex(a => a == e)
                                    this.state.dia = (index + 1);
                                    this.setState({ ...this.state })
                                }}
                            />
                        </SView>
                    }
                })
            }} >{selectdate.getDayOfWeekJson().text} {selectdate.getDay()},</SText>
            <SView width={8} />
            <SText padding={6} card onPress={(e) => {
                const startYear = new SDate().getYear();
                const endYear = startYear + 20;
                const yearsArray = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
                InputFloat.open({
                    e: e,
                    width: 100,
                    height: 100,
                    style: {
                        backgroundColor: STheme.color.background
                    },
                    render: () => {
                        return <SView col={"xs-12"} height withoutFeedback card>
                            <InputSelect
                                ITEM_HEIGHT={25}
                                data={yearsArray}
                                defaultValue={this.state.ano}
                                onChange={(e) => {
                                    this.setState({ ano: e })
                                    this.state.ano = e;
                                }}
                            />
                            {/* <SView style={{ width: "100%", height: 80, bottom: 0, position: "absolute", backgroundColor: STheme.color.secondary }} center onPress={() => {
                                this.setState({ ...this.state })
                            }}>
                                <SText color={STheme.color.primary}>{"ACEPTAR"}</SText>
                            </SView> */}
                        </SView>
                    }
                })

            }} >{this.state.ano}</SText>
        </SView >
    }
}
