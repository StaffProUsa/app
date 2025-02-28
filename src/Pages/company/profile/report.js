import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SImage, SLanguage, SLoad, SNavigation, SNotification, SPage, STable2, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PermisoNotFound from '../../../Components/PermisoNotFound';
import Model from '../../../Model';
import { connect } from 'servisofts-page';
import FiltroEntreFechas from '../../../Components/Filtros/FiltroEntreFechas';

class report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            staff_tipo: {},
         
        };
        this.pk = SNavigation.getParam("pk");
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        
    }

    loadData({ fecha_inicio, fecha_fin }) {
        SSocket.sendPromise({
            component: "staff_tipo",
            type: "getAll",
        }).then(e => {
            if (!e.data) return;
            this.setState({ staff_tipo: e.data })
            SSocket.sendPromise({
                component: "company",
                type: "getReporteGeneral",
                key_company: this.pk,
                fecha_inicio: fecha_inicio,
                fecha_fin: fecha_fin
            }).then(f => {
                if (!f.data) return;
                this.setState({ data: f.data })
            })
        }).catch(e => {
            SNotification.send({
                title: "Error",
                body: e?.error ?? e,
                color: STheme.color.danger,
                time: 5000
            })
        })
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    render() {
        let permiso_users = Model.usuarioPage.Action.getPermiso({ url: "/company/profile/report", permiso: "ver", user_data: { key_company: this.pk } });
        if (permiso_users == "cargando") return <SLoad />
        if (!permiso_users) return <PermisoNotFound />
        const users = Model.usuario.Action.getAll() ?? {};
        return <SPage title={"Reporte"} titleLanguage={{
            es: "Reporte Compañía",
            en: "Company Report"
        }} disableScroll>
            <FiltroEntreFechas type='mes'  onChange={(evt) => {
                this.loadData(evt)
            }} />
            <SView col={"xs-12"} flex>
                <STable2
                    data={this.state.data}
                    header={[
                        { key: "index", label: "#", width: 20 },
                        // { key: "key_usuario", label: "ku", width: 300 },
                        {
                            key: "cliente/key", label: SLanguage.select({
                                en: "Photo",
                                es: "Foto"
                            }), width: 30, component: (key) => <SView card width={25} height={25} center
                                style={{ borderRadius: 4, overflow: "hidden" }}>
                                <SImage enablePreview src={SSocket.api.root + "cliente/" + key} style={{
                                    resizeMode: "cover",
                                }} /></SView>
                        },
                        {
                            key: "cliente", label: SLanguage.select({
                                en: "Client",
                                es: "Cliente"
                            }), width: 150, component: (cliente) =>
                                <SText fontSize={11} color={STheme.color.text} underLine onPress={() => {
                                    SNavigation.navigate("/cliente/profile", { pk: cliente.key })
                                }}>
                                    {cliente.descripcion}
                                </SText>
                        },
                        {
                            key: "evento/descripcion", label: SLanguage.select({
                                en: "Event",
                                es: "Evento"
                            }), width: 150
                        },
                        {
                            key: "evento/fecha", order: "desc", label: SLanguage.select({
                                en: "Date",
                                es: "Fecha"
                            }), width: 100, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy")
                        },
                        {
                            key: "staff/fecha_inicio", label: SLanguage.select({
                                en: "Start",
                                es: "Inicio"
                            }), center: true, width: 60, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                        },
                        {
                            key: "staff/fecha_fin", label: SLanguage.select({
                                en: "End",
                                es: "Fin"
                            }), center: true, width: 60, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                        },
                        {
                            key: "key_usuario-img", label: SLanguage.select({
                                en: "Photo",
                                es: "Foto"
                            }), width: 30, component: (usr) => <SView card width={25} height={25} center
                                style={{ borderRadius: 4, overflow: "hidden" }}>
                                <SImage enablePreview src={SSocket.api.root + "usuario/" + usr} style={{
                                    resizeMode: "cover",
                                }} /></SView>
                        },
                        {
                            key: "key_usuario", cellStyle: { fontSize: 12 }, label: SLanguage.select({
                                en: "User",
                                es: "Usuario"
                            }), width: 150, render: ku => {
                                const user = users[ku]
                                return `${user?.Nombres} ${user?.Apellidos}`
                            }
                        },
                        {
                            key: "fecha_ingreso", label: SLanguage.select({
                                en: "Clock In",
                                es: "Ingreso"
                            }), center: true,
                            width: 80,
                            render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH"),
                        },
                        {
                            key: "fecha_salida", label: SLanguage.select({
                                en: "Clock Out",
                                es: "Salida"
                            }), center: true, width: 80,
                            render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")
                        },
                        {
                            key: "-horas", label: SLanguage.select({
                                en: "Hours",
                                es: "Horas"
                            }), cellStyle: { fontSize: 14, fontWeight: "bold" }, sumar: true, center: true, width: 50,
                            render: a => {
                                if (!a.fecha_ingreso || !a.fecha_salida) {
                                    return "";
                                }

                                const fi = new SDate(a.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD")
                                const fs = new SDate(a.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD")
                                const disf = fi.diffTime(fs);
                                return ((disf / 1000) / 60 / 60).toFixed(2);

                            },

                        },

                        {
                            key: "staff/key_staff_tipo", label: SLanguage.select({
                                en: "Staff",
                                es: "Staff"
                            }), width: 80,
                            render: ku => {
                                const staff_tipo = this.state.staff_tipo[ku]
                                return `${staff_tipo?.descripcion}`
                            }
                        },
                        {
                            key: "staff/descripcion", label: SLanguage.select({
                                en: "Description",
                                es: "Descripción"
                            }), width: 80
                        },

                    ]}
                />
            </SView>
        </SPage>
    }
}
export default connect(report);