import React, { Component } from 'react';
import { View, Text, TextStyle, Dimensions } from 'react-native';
import { SDate, SIcon, SImage, SLanguage, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table';
import SelectRol from '../roles/Components/SelectRol';
import Model from '../../../Model';
import staff from '../../staff';
import Config from '../../../Config';

const ImageLabel = ({ label, src, textStyle, wrap = true }) => {
    return <SView row >
        <SView width={16} height={16} style={{ borderRadius: 100, overflow: "hidden", backgroundColor: STheme.color.card }}>
            <SImage src={src} style={{
                resizeMode: "cover"
            }} />
        </SView>
        <SView width={4} />
        <Text style={[textStyle, { flex: 1 }]} numberOfLines={!wrap ? 0 : 1} >{label}</Text>
    </SView>
}

export default class MoveStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_company: SNavigation.getParam("pk"),
            show_disabled: true,
            show_enabled: true,
            data: []
        };
        this.key_company = SNavigation.getParam("pk");
    }

    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }

    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        this.getData({ key_company: this.key_company }).then((users) => {
            console.log(users)
            this.setState({ data: users })
        })
    }

    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    getData = async ({ key_company }) => {
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
        const roles = await SSocket.sendPromise({
            service: "roles_permisos",
            component: "rol",
            type: "getAll",
        })
        this.state.roles = roles.data;
        console.log(roles)
        Object.values(staff_response.data).map(o => {
            // o.usuario = users_request?.data[o.key_usuario]?.usuario ?? { Nombres: "User", Apellidos: "Deleted" };
            o.usuario = users_request?.data[o.key_usuario]?.usuario ?? { Nombres: "User", Apellidos: "Deleted" };
            o.rol = roles?.data[o.key_rol]
        })
        let users = Object.values(staff_response.data).filter(a => a.usuario?.Nombres !== "User");
        console.log("users", users)
        console.log("staff_response", staff_response.data)
        return users;
    }

    loadData = async () => {
        const staff_response = await SSocket.sendPromise({
            component: "usuario_company",
            type: "getAllStaff",
            key_company: this.key_company
        })
        let keys = [...new Set(Object.values(staff_response.data).map(a => a.key_usuario).filter(key => key !== null))];

        const users_request = await SSocket.sendPromise({
            version: "2.0",
            service: "usuario",
            component: "usuario",
            type: "getAllKeys",
            keys: keys,
        });
        const roles = await SSocket.sendPromise({
            service: "roles_permisos",
            component: "rol",
            type: "getAll",
        })
        this.state.roles = roles.data;
        Object.values(staff_response.data).map(o => {
            o.usuario = users_request?.data[o.key_usuario]?.usuario ?? { Nombres: "User", Apellidos: "Deleted" };
            o.rol = roles?.data[o.key_rol]
        })
        // return Object.values(staff_response.data);
        return Object.values(staff_response.data).filter(a => a.usuario?.Nombres !== "User")
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

    renderRol(obj) {
        let permiso_Edit_Rol = Model.usuarioPage.Action.getPermiso({ url: "/company/profile/users", permiso: "edit_rol", user_data: { key_company: this.key_company } })
        return <SView col={"xs-12"} center onPress={!permiso_Edit_Rol ? () => {
            SNotification.send({
                title: SLanguage.select({
                    es: "No tienes permisos",
                    en: "You do not have permissions",
                }),
                color: STheme.color.warning,
                time: 5000
            })
        } : (e) => {
            e.currentTarget.measure((x, y, width, height, pageX, pageY) => {
                const key_popup = "popupkey";
                const windowheight = Dimensions.get("window").height
                const itemWidth = 200;
                const itemHeight = 176;
                let top = pageY + 30;
                if (itemHeight + top > windowheight) {
                    top = windowheight - itemHeight;
                }
                SPopup.open({
                    key: key_popup,
                    type: "2",
                    content: <SelectRol
                        roles={Object.values(this.state.roles).filter(a => a.tipo == "company")}
                        style={{
                            left: pageX,
                            top: top,
                            itemWidth: itemWidth,
                            itemHeight: itemHeight,
                        }}
                        onSelect={(e) => {
                            SPopup.confirm({
                                title: SLanguage.select({
                                    es: "¿Estás seguro?",
                                    en: "Are you sure?",
                                }),
                                message: SLanguage.select({
                                    es: "El rol del usuario será modificado.",
                                    en: "The user's role will be changed.",
                                }),
                                onPress: () => {
                                    SSocket.sendPromise({
                                        component: "usuario_company",
                                        type: "editar",
                                        data: {
                                            key: obj.key,
                                            key_rol: e.key
                                        }
                                    }).then(f => {
                                        obj.key_rol = e.key
                                        obj.rol = e;
                                        this.setState({ ...this.state })
                                    }).catch(f => {

                                    })
                                }
                            })

                            // const inp = this._inputs.rol
                            // if (inp) {
                            //     inp.setValue(e.descripcion)
                            //     inp.setData(e)
                            // }
                            SPopup.close(key_popup)
                        }}
                    />
                })
            })
        }}>
            <SView style={{
                padding: 2,
                paddingStart: 4, paddingEnd: 4,
                borderRadius: 8,
                backgroundColor: obj?.rol?.color + "77" ?? "#66666666"
            }}><SText fontSize={10}>{obj?.rol?.descripcion}</SText></SView>
        </SView>
    }

    renderEstado(estado) {
        const val = {
            color: STheme.color.danger,
            text: SLanguage.select({ en: "DISABLED", es: "DESHAB." })
        }
        if (estado == 2) {
            val.color = STheme.color.success
            val.text = SLanguage.select({ en: "ENABLED", es: "HABILIT." })
        }
        return <SView width={38} height={12}
            backgroundColor={val.color}
            center
            style={{
                borderRadius: 2
            }} >
            <SText fontSize={7} bold color={STheme.color.white}>{val.text}</SText>
        </SView>
    }

    renderNew(fecha_on) {
        let fecha = new Date(fecha_on)
        let fecha_actual = new Date()
        let rango = new Date();
        rango.setDate(fecha_actual.getDate() - 7)
        if (fecha.getTime() >= rango.getTime()) {
            return <SView width={38} height={12}
                backgroundColor={STheme.color.warning}
                center
                style={{
                    borderRadius: 2
                }} >
                <SText fontSize={7} bold color={STheme.color.white}>NEW</SText>
            </SView>
        }
    }

    handleChangeStatus(obj) {
        console.log("objetito")
        console.log(obj)
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

    render() {
        let permiso_habilitar = Model.usuarioPage.Action.getPermiso({ url: "/company/profile/users", permiso: "habilitar", user_data: { key_company: this.key_company } })

        return <SPage tile={""} disableScroll>
            <SView col={"xs-12"} height backgroundColor={STheme.color.background} withoutFeedback>
                <DinamicTable
                    loadInitialState={async () => {
                        return {
                            "filters": [
                                {
                                    "col": "estado",
                                    "type": "string",
                                    "operator": "=",
                                    "value": [
                                        "enabled"
                                    ]
                                },

                            ],
                            "sorters": [
                                {
                                    "key": "alta",
                                    "order": "asc",
                                    "type": "string"
                                }
                            ]
                        }
                    }}
                    loadData={this.loadData.bind(this)}
                    colors={Config.table.styles()}
                    cellStyle={Config.table.cellStyle()}
                    textStyle={Config.table.textStyle()}
                >
                    {/* <DinamicTable.Col key={"index"} data={p => p.index} label='#' width={30} /> */}

                    <DinamicTable.Col key={"edit"} label='Editar' width={40}
                        data={e => ""}
                        customComponent={e => <SView onPress={() => { SNavigation.navigate("/usuario/edit", { pk: e.row.key_usuario, key_company: this.key_company }) }}><SIcon name='Edit' width={20} height={20} /></SView>}
                    />

                    <DinamicTable.Col
                        key={"estado"}
                        label='Estado'
                        width={60}
                        data={p => p.row.estado == 2 ? "enabled" : "disabled"}

                        customComponent={p => <SView onPress={() => {
                            if (!permiso_habilitar) {
                                SNotification.send({
                                    title: SLanguage.select({
                                        es: "No tienes permisos",
                                        en: "You do not have permissions",
                                    }),
                                    color: STheme.color.warning,
                                    time: 5000
                                })
                                return
                            }
                            this.handleChangeStatus(p.row)
                        }}>{this.renderEstado(p.row.estado)}</SView>}

                    />
                    <DinamicTable.Col
                        key={"nuevo"}
                        label='Nuevo'
                        width={60}
                        // data={p => p.row.estado == 2 ? "enabled" : "disabled"}
                        data={p => {
                            let fecha = new Date(p.row.fecha_on)
                            let fecha_actual = new Date()

                            let rango = new Date();
                            rango.setDate(fecha_actual.getDate() - 7)
                            if (fecha.getTime() >= rango.getTime()) return true
                            return false;
                        }}

                        customComponent={p => <SView >{this.renderNew(p.row.fecha_on)}</SView>}

                    />
                    <DinamicTable.Col
                        key={"rol"}
                        label='Rol en la empresa'
                        data={p => p.row.rol.descripcion}
                        customComponent={p => this.renderRol(p.row)}
                    />

                    <DinamicTable.Col key={"employee"} data={p => p.row.employee_number ? p.row.employee_number : ""} label='Nro. empleado' />
                    <DinamicTable.Col key={"salario"} data={p => p.row.salario_hora ? p.row.salario_hora : ""} label='Salario' />
                    <DinamicTable.Col key={"NombreUser"} label='Nombre usuario' width={150}
                        data={e => e.row.usuario.Nombres + " " + e.row.usuario.Apellidos}
                        customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "usuario/" + e.row?.usuario?.key} textStyle={e.textStyle} />}
                    />
                    <DinamicTable.Col key={"telefono"} data={p => p.row?.usuario?.Telefono} label='Teléfono' />
                    <DinamicTable.Col key={"email"} data={p => p.row.usuario.Correo} label='Email' />
                    <DinamicTable.Col key={"ingles"} data={p => p.row.usuario.nivel_ingles} label='Nivel de Inglés' />
                    <DinamicTable.Col key={"papeles"} data={p => p.row.usuario.papeles} label='¿Tiene papeles?' />
                    <DinamicTable.Col key={"estadoCivil"} data={p => p.row.usuario.estado_civil} label='Estado civil' />
                    <DinamicTable.Col key={"nacimiento"} data={p => new SDate(p.row.usuario.fecha_nacimiento).toString("MONTH dd, yyyy")} label='Fecha de Nac.' />
                    <DinamicTable.Col key={"direccion"} data={p => p.row.usuario.direccion} label='Dirección' />
                    <DinamicTable.Col key={"idiomas"} width={130} data={p => p.row.usuario.otros_idiomas} label='Estatus legal' />
                    <DinamicTable.Col key={"alta"} width={130} data={p => new SDate(p.row.fecha_on).toString("MONTH dd, yyyy")} label='Fecha de alta' />
                    <DinamicTable.Col key={"position"} label='Posición' width={50}
                        data={e => ""}
                        customComponent={e => <SView height={20} onPress={() => { SNavigation.navigate("/perfil/staff_tipo", { key_usuario: e.row.key_usuario, key_company: this.key_company }) }}><SIcon name='iposition' width={20} height={20} fill={STheme.color.text} /></SView>}
                    />
                    <DinamicTable.Col
                        key={"posicion"}
                        label='Posición'
                        width={500}
                        data={p => Object.values(p.row.staff_tipo || {}).map(o => o.descripcion).join(", ")}
                        customComponent={p => <SView row style={{ overflow: "hidden" }}>
                            {Object.values(p.row.staff_tipo || {}).map(e => this.renderStaffTipo(e))}
                        </SView>}
                    />

                </DinamicTable>
            </SView >
        </SPage>
    }
}