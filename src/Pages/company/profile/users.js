import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SDate, SIcon, SImage, SInput, SLanguage, SLoad, SNavigation, SNotification, SPage, SPopup, STable, STable2, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import SelectRol from '../roles/Components/SelectRol';
import { connect } from 'servisofts-page';
import PermisoNotFound from '../../../Components/PermisoNotFound';



class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_company: SNavigation.getParam("pk"),
            show_disabled: true,
            show_enabled: true,
            data: {}
        };
        this.key_company = SNavigation.getParam("pk");
    }

    componentDidMount() {


        this.getData({ key_company: this.key_company }).then((users) => {
            console.log(users)
            this.setState({ data: users })
        })
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
            o.usuario = users_request?.data[o.key_usuario]?.usuario;
            o.rol = roles?.data[o.key_rol]
        })
        return staff_response.data;
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
            <SText fontSize={6} bold color={STheme.color.white}>{val.text}</SText>
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
    renderRol(obj) {
        let permiso_Edit_Rol = Model.usuarioPage.Action.getPermiso({ url: "/company/profile/users", permiso: "edit_rol", user_data: { key_company: this.key_company } })

        return <SView col={"xs-12"} height center onPress={!permiso_Edit_Rol ? () => {
            SNotification.send({
                title: SLanguage.select({
                    es: "No tienes permisos",
                    en: "TODO: lan",
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
        let permiso = Model.usuarioPage.Action.getPermiso({ url: "/company/profile/users", permiso: "ver", user_data: { key_company: this.key_company } })
        if (permiso == "cargando") return <SLoad />
        if (!permiso) return <PermisoNotFound />
        let permiso_habilitar = Model.usuarioPage.Action.getPermiso({ url: "/company/profile/users", permiso: "habilitar", user_data: { key_company: this.key_company } })
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
                        { key: "usuario/key", label: "Edit", width: 40, component: (a) => <SView card padding={4} onPress={() => { SNavigation.navigate("/usuario/edit", { pk: a, key_company: this.key_company }) }}><SIcon name='Edit' width={20} height={20} /></SView> },
                        {
                            key: "-estado", label: "Status", width: 40,
                            component: (a) => this.renderEstado(a.estado), onPress: (a, b, c) => {
                                if (!permiso_habilitar) {
                                    SNotification.send({
                                        title: SLanguage.select({
                                            es: "No tienes permisos",
                                            en: "TODO: lan",
                                        }),
                                        color: STheme.color.warning,
                                        time: 5000
                                    })
                                    return
                                }
                                this.handleChangeStatus(a)
                            }, renderExcel: (e) => e.estado == 2 ? "enabled" : "disabled"
                        },
                        {
                            key: "-rol", label: "Rol in company", width: 100, component: this.renderRol.bind(this),
                            renderExcel: e => e?.rol?.descripcion
                        },

                        {
                            key: "usuario/key-foto", label: "Img", width: 40,
                            component: (a) => <SImage enablePreview style={{ width: 30, height: 30, resizeMode: "cover" }} src={SSocket.api.root + "usuario/" + a} />
                        },
                        { key: "usuario/employee_number", label: "Employee Number", width: 100 },
                        { key: "usuario-name", label: "Full Name", order: "asc", width: 160, render: (a) => `${a.Nombres} ${a.Apellidos}` },
                        { key: "usuario/Telefono", label: "Phone Number", width: 100 },
                        { key: "usuario/Correo", label: "Email", width: 170, },
                        { key: "usuario/nivel_ingles", label: "English level", width: 80, cellStyle: { textAlign: "center" } },
                        { key: "usuario/papeles", label: "Has Papers?", width: 70, cellStyle: { textAlign: "center" } },
                        { key: "usuario/estado_civil", label: "Marital Status", width: 70 },
                        { key: "usuario/fecha_nacimiento", label: "Dae of Birth", width: 70, cellStyle: { textAlign: "center" } },
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
export default connect(root);