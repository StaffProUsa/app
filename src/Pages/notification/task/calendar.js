import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SList, SDate, SIcon, SList2, SLoad, SNavigation, SPage, SPopup, SText, STheme, SView, SHr } from "servisofts-component";
import SSocket from 'servisofts-socket';
import Dia from '../../../Components/Dia';
import Model from '../../../Model';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curDay: new SDate(),
            parametros: {
                "inicio": new SDate().setDay(1).toString("yyyy-MM-dd"),
                "fin": new SDate().addMonth(5).setDay(1).addDay(-1).toString("yyyy-MM-dd"),
            },
            ...this.state,
        };
    }
    componentDidMount() {
        // this.getData();
    }

    getData() {
        // this.setState({ loading: "cargando", data: null });
        // SSocket.sendPromise({
        //     service: "notification",
        //     component: "notification_task",
        //     type: "getAll",
        // }).then(e => {
        //     this.setState({ loading: false, data: e.data })
        // }).catch(e => {
        //     this.setState({ loading: false })
        //     SPopup.alert("No se pudo cargar los datos")
        //     console.error(e);
        // })
    }

    renderDias(data, i) {
        let hoy = this.state.curDay.toString('dd')

        return <>
            <SView col={"xs-1.7"} height={135}
                center
                style={{
                    borderWidth: 1,
                    borderColor: hoy == data.dayMonth ? "COLOR" : STheme.color.gray,
                    backgroundColor: STheme.color.card,
                }}
            >
                <SView
                    row
                    style={{
                        height: 30,
                        width: "100%",
                        padding: 4,
                    }}
                >
                    <SText center flex
                        font={"Roboto"} fontSize={10} color={STheme.color.text}
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: 20,
                            alignContent: "center",
                            backgroundColor: hoy == data.dayMonth ? "blue" : "transparent",
                        }}
                    > {data.dayMonth || ""}</SText>

                    {data.dayMonth ?
                        <SView
                            center
                            style={{
                                position: "absolute",
                                top: 5,
                                right: 2
                            }}

                            onPress={() => {
                                let fechaString = data?.fecha.toString("yyyy-MM-dd")
                                SNavigation.navigate("/notification/task/new", { fecha: fechaString })
                            }}
                        >
                            <SText center flex
                                font={"Roboto"} fontSize={13} color={STheme.color.text}
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: 20,
                                    alignContent: "center",
                                    backgroundColor: STheme.color.success,
                                    color: STheme.color.text
                                }}
                            >+</SText>
                        </SView>
                        : null}
                </SView>


                <SList
                    data={data?.dataAux}
                    filter={a => a.estado != 0}
                    order={[{ key: "fecha_send", order: "asc" }]}
                    render={(k) => {
                        let horaNotificacion = new SDate(k.fecha_send, "yyyy-MM-ddThh:mm:ss").toString("hh:mm");

                        return <>
                            <SView
                                row
                                col={"xs-9"}
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: STheme.color.text,
                                    padding: 4,
                                    margin: 6,
                                }}
                                onPress={() => {
                                    SNavigation.navigate("/notification/task/edit", { pk: k.key })
                                }}
                            >
                                <SText font={"Roboto"} fontSize={12} color={STheme.color.text} flex>{k?.notification?.data?.descripcion}</SText>
                                <SText center font={"Roboto"} fontSize={12} color={STheme.color.text}>{horaNotificacion}</SText>
                            </SView>
                        </>
                    }}
                />
            </SView >
        </>
    }

    getCabecera() {
        return <>
            <SView col={"xs-12"} row >
                <Dia dia="DOM" />
                <Dia dia="LUN" />
                <Dia dia="MAR" />
                <Dia dia="MIE" />
                <Dia dia="JUE" />
                <Dia dia="VIE" />
                <Dia dia="SAB" />
            </SView>
        </>
    }

    getCalendario({ month, age }) {
        let primerDiaSemana = new Date(age, month, 1).getDay();
        let fechaFin = new Date(age, month + 1, 1);
        fechaFin = fechaFin.setDate(fechaFin.getDate() - 1);
        let ultimoDayMonth = new Date(fechaFin).getDate()

        var dataNotification = this.state.data;
        if (!dataNotification) return null;

        let calendario = [];
        var index = 0;
        var dayMonth = 0;
        var dataAux;
        var dataMostrar = [];


        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                index++;
                if (i == 0 && j < primerDiaSemana) {
                    calendario.push({ index, dia_semana: j, semana: i, fecha: null })
                } else {
                    if (dayMonth < ultimoDayMonth) {
                        dayMonth++;

                        let fechaActual = new Date(age, month, dayMonth)
                        let sdActual = new SDate(fechaActual);

                        Object.values(dataNotification).map((obj) => {
                            if (new SDate(obj.fecha_send, "yyyy-MM-dd").equalDay(sdActual)) {
                                dataAux = obj;
                                dataMostrar.push(dataAux)
                            }
                        })

                        calendario.push({ dayMonth, index, dia_semana: j, semana: i, fecha: sdActual, dataAux: dataMostrar, paquete: dataMostrar[0] })
                        dataAux = null;
                        dataMostrar = []
                    } else {
                        dataAux = null;
                        dataMostrar = []
                        calendario.push({ index, dia_semana: j, semana: i, fecha: new Date(age, month, dayMonth) })
                    }
                }
            }
        }

        return <>
            <SView col={"xs-11.9"} row center backgroundColor={STheme.color.primary}
                style={{
                    borderTopLeftRadius: 12, borderTopRightRadius: 12,
                }}
            >
                <SView col={"xs-2"} onPress={() => {
                    this.setState({ curDay: this.state.curDay.addMonth(-1) })
                }}>
                    <SIcon name='Back' height={20} fill={STheme.color.secondary} />
                </SView>
                <SView col={"xs-8"} center height={55}>
                    <SText fontSize={18} bold style={{ color: STheme.color.white }}>{this.state.curDay.toString("MONTH, yyyy")}</SText>
                </SView>
                <SView col={"xs-2"} onPress={() => {
                    this.setState({ curDay: this.state.curDay.addMonth(1) })
                }}>
                    <SIcon name='Back' style={{ transform: [{ rotate: "180deg" }] }} height={20} fill={STheme.color.secondary} />
                </SView>
            </SView>
            {this.getCabecera()}
            <SView col={"xs-12"} row center  >
                <SList2
                    horizontal
                    space={0}
                    data={calendario}
                    render={
                        this.renderDias.bind(this)
                    }
                />
            </SView>
        </>
    }

    getBody() {

        return <>
            <SView col={"xs-12"} row  >
                {this.getCalendario({ month: this.state.curDay.getMonth() - 1, age: this.state.curDay.getYear() })}
            </SView>
        </>
    }

    render() {
        this.state.data = Model.notification_task.Action.getAll();
        if (!this.state.data) return <SLoad />



        let fi = new SDate(this.state.curDay.toString("yyyy-MM-dd")).setDay(1).toString("yyyy-MM-dd");
        let ff = new SDate(this.state.curDay.toString("yyyy-MM-dd")).addMonth(1).setDay(1).addDay(-1).toString("yyyy-MM-dd");
        return (
            <SPage title={"Notificación Programadas " + fi + " " + ff} >
                <SView col={"xs-12"}>
                    {this.getBody()}
                </SView>
            </SPage>
        )
    }
}
const initStates = (state) => {
    return { state };
};
export default connect(initStates)(index);
