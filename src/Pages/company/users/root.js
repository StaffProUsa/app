import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SInput, SNavigation, SPage, STable, STable2, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';

const getData = async ({ key_company }) => {
    const staff_response = await SSocket.sendPromise({
        component: "usuario_company",
        type: "getAllStaff",
        key_company: key_company
    })
    let keys = [...new Set(Object.values(staff_response.data).map(a => a.key_usuario).filter(key => key !== null))];
    const users_request = await SSocket.sendPromise({
        version: "2.0",
        service: "usuario",
        component: "usuario",
        type: "getAllKeys",
        keys: keys,
    });
    Object.values(staff_response.data).map(o => {
        o.usuario = users_request.data[o.key_usuario]?.usuario;
    })
    return staff_response.data;
}

export default class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_company: SNavigation.getParam("key_company"),
            show_disabled: true,
            show_enabled: true,
            data: {}
        };
    }
    componentDidMount() {
        getData({ key_company: this.state.key_company }).then((users) => {
            console.log(users)
            this.setState({ data: users })
        })
    }

    renderEstado(estado) {
        const val = {
            color: STheme.color.danger,
            text: "DISABLED"
        }
        if (estado == 2) {
            val.color = STheme.color.success
            val.text = "ENABLED"
        }
        return <SView width={35} height={12}
            backgroundColor={val.color}
            center
            style={{
                borderRadius: 2
            }} >
            <SText fontSize={6} bold>{val.text}</SText>
        </SView>
    }
    handleChangeStatus(obj) {
        SSocket.sendPromise({
            component: "usuario_company",
            type: "editar",
            key_usuario: Model.usuario.Action.getKey(),
            data: {
                key: obj.key,
                estado: obj.estado == 2 ? 1 : 2,
            }
        }).then(e => {
            obj.estado = e.data.estado;
            this.setState({ ...this.state })
        }).catch(e => {

        })
    }

    renderStaffTipo(staffTipo) {
        return <Text style={{
            padding: 0,
            paddingLeft: 4,
            paddingRight: 4,
            // borderWidth: 1,
            height: 12,
            borderColor: staffTipo?.color ?? STheme.color.success,
            backgroundColor: (staffTipo?.color ?? STheme.color.success) + "44",
            borderRadius: 100,
            color: STheme.color.text,
            fontSize: 10,
            marginRight: 4,
            marginBottom: 2,
            paddingBottom: 1,
        }} bold>{staffTipo?.descripcion}</Text>
    }

    render() {
        return <SPage title={"Users"} disableScroll>
            <SView col={"xs-12"} height={20} row>
                <SText card style={{
                    opacity: this.state.show_disabled ? 1 : 0.6,
                }} fontSize={10} center padding={2} onPress={() => {
                    this.state.show_disabled = !this.state.show_disabled
                    this.setState({ ...this.state })
                }}>{"Show Disabled"}</SText>
                <SView width={8} />
                <SText card style={{
                    opacity: this.state.show_enabled ? 1 : 0.6,
                }} fontSize={10} center padding={2} onPress={() => {
                    this.state.show_enabled = !this.state.show_enabled
                    this.setState({ ...this.state })
                }}>{"Show Enabled"}</SText>
            </SView>
            <SView col={"xs-12"} flex>
                <STable2
                    data={Object.values(this.state.data).filter(a => {
                        if (!this.state.show_disabled && a.estado != 2) return false;
                        if (!this.state.show_enabled && a.estado == 2) return false;
                        return true;
                    })}
                    rowHeight={30}
                    header={[
                        { key: "index", label: "#", width: 20, component: (a) => <SView card padding={4}><SText fontSize={8}>{a}</SText></SView> },
                        { key: "usuario/key", label: "Edit", width: 40, component: (a) => <SView card padding={4} onPress={()=>{SNavigation.navigate("/usuario/edit",{pk:a})}}><SIcon name='Edit' width={20} height={20}/></SView> },
                        {
                            key: "-estado", label: "Status", width: 40,
                            component: (a) => this.renderEstado(a.estado), onPress: (a, b, c) => {
                                this.handleChangeStatus(a)
                            }, renderExcel: (e) => e.estado == 2 ? "enabled" : "disabled"
                        },
                        { key: "usuario-name", label: "Full Name", order: "asc", width: 160, render: (a) => `${a.Nombres} ${a.Apellidos}` },
                        { key: "usuario/Telefono", label: "Phone Number", width: 100 },
                        { key: "usuario/Correo", label: "Email", width: 170, },
                        { key: "usuario/nivel_ingles", label: "English level", width: 80, cellStyle: { textAlign: "center" } },
                        { key: "usuario/papeles", label: "Has Papers?", width: 70, cellStyle: { textAlign: "center" } },
                        { key: "usuario/estado_civil", label: "Marital Status", width: 70 },
                        { key: "usuario/fecha_nacimiento", label: "Dae of Birth", width: 70, cellStyle: { textAlign: "center" } },
                        { key: "usuario/employee_number", label: "Employee Number", width: 100 },
                        { key: "usuario/direccion", label: "Affress", width: 150 },
                        { key: "usuario/otros_idiomas", label: "Other Languages", width: 150 },
                        { key: "fecha_on", label: "Date added", width: 150, cellStyle: { textAlign: "right", paddingRight: 4 }, render: (a) => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy") },
                        {
                            key: "staff_tipo", label: "Position", width: 600,
                            component: (a) => {
                                if (!a) return <SText>{""}</SText>;
                                return <SView row col={"xs-12"}>{a.map(o => this.renderStaffTipo(o))}</SView>
                            },
                            renderExcel: (a) => {
                                if (!a) return "";
                                return a.map(b => b.descripcion)
                            }
                        },
                    ]}

                />
            </SView>
        </SPage >
    }
}
