import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SNotification, SPage, SPopup, STable2, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { connect } from 'react-redux';
import InputHora from '../Components/NuevoInputs/InputHora';
import InputFloat from '../Components/NuevoInputs/InputFloat';

class boss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }
    componentDidMount() {
        this.loadData()
    }

    loadData() {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getMisTrabajadores",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.log(e);
        })
    }

    handlePressEdit(obj) {
        SPopup.open({
            key: "editar",
            content: <SView col={"xs-12"} height={300} backgroundColor={STheme.color.background} withoutFeedback center>

            </SView>
        })
    }
    handleOpen(obj) {
        SPopup.confirm({
            title: "Seguro de marcar Clock in al usuario",
            onPress: () => {
                SNotification.send({
                    key: "register_object",
                    title: "Loading...",
                    type: "loading",
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "editar",
                    data: {
                        key: obj.key,
                        fecha_ingreso: new SDate().toString()
                    }
                }).then(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "Success",
                        time: 5000,
                        color: STheme.color.success
                    })
                    this.loadData()
                }).catch(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "error",
                        time: 5000,
                        color: STheme.color.danger
                    })
                })
            }
        })
    }
    handleClose(obj) {
        SPopup.confirm({
            title: "Seguro de marcar Clock out al usuario",
            onPress: () => {

                SNotification.send({
                    key: "register_object",
                    title: "Loading...",
                    type: "loading",
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "editar",
                    data: {
                        key: obj.key,
                        fecha_salida: new SDate().toString()
                    }
                }).then(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "Success",
                        time: 5000,
                        color: STheme.color.success
                    })
                    this.loadData()
                }).catch(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "error",
                        time: 5000,
                        color: STheme.color.danger
                    })
                })
            }
        })
    }

    render() {
        const users = Model.usuario.Action.getAll() ?? {};
        return <SPage titleLanguage={{ en: "Boss", es: "Jefe" }} disableScroll
            header={<SText onPress={() => {
                this.setState({ data: {} })
                this.loadData()
            }}>{"RELOAD"}</SText>}>
            <STable2 data={this.state.data}
                rowHeight={30}
                header={[
                    { key: "index", width: 50 },
                    {
                        key: "-options", width: 150, renderExcel: a => "-", component: (obj) => {

                            return <SView col={"xs-12"} flex row >
                                <SView width={8} />
                                <SView width={20} height={20} onPress={this.handlePressEdit.bind(this, obj)}><SIcon name='Edit' /></SView>
                                <SView width={8} />
                                {!!obj.fecha_ingreso ? null : <SView width={20} height={20} onPress={this.handleOpen.bind(this, obj)}><SIcon name='Add' /></SView>}
                                <SView width={8} />
                                {!obj.fecha_salida && !!obj.fecha_ingreso ? <SView width={20} height={20} onPress={this.handleClose.bind(this, obj)}><SIcon name='Close' fill={"#fff"} /></SView> : null}
                            </SView>
                        }
                    },
                    {
                        key: "key_usuario", width: 150, render: ku => {
                            const user = users[ku]
                            return `${user?.Nombres} ${user?.Apellidos}`
                        }
                    },

                    { key: "evento/fecha", width: 100, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy") },
                    { key: "staff/fecha_inicio", center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("HH") },
                    { key: "staff/fecha_fin", center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("HH") },
                    {
                        key: "fecha_ingreso", center: true,
                        width: 150,
                        render: a => !a ? "No Clock In" : new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("yyyy MONTH dd, HH"),
                    },
                    { key: "fecha_salida", center: true, width: 150, render: a => !a ? "No Clock Out" : new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("yyyy MONTH dd, HH") },
                    {
                        key: "-horas", center: true, width: 50,
                        render: a => {
                            if (!a.fecha_ingreso || !a.fecha_salida) {
                                return "";
                            }

                            const fi = new SDate(a.fecha_ingreso, "yyyy-MM-ddThh:mm:ss")
                            const fs = new SDate(a.fecha_salida, "yyyy-MM-ddThh:mm:ss")
                            const disf = fi.diff(fs);
                            return disf;

                        },
                    },

                    { key: "evento/descripcion", width: 150 },
                    { key: "evento/descripcion", width: 150 },
                    { key: "cliente/descripcion", width: 150 },
                    { key: "staff/descripcion", width: 150 },
                    { key: "staff_tipo/descripcion", width: 150 },
                ]}
            />
        </SPage>
    }
}

const initStates = (state) => {
    return { state };
};
export default connect(initStates)(boss);
