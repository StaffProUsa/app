import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SImage, SInput, SLanguage, SLoad, SNavigation, SNotification, SPage, STable2, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PermisoNotFound from '../../Components/PermisoNotFound';
import Model from '../../Model';
import { connect } from 'servisofts-page';
import FiltroEntreFechas from '../../Components/Filtros/FiltroEntreFechas';

class reportCompany extends Component {
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
        this.loadData()
        SLanguage.addListener(this.onChangeLanguage.bind(this))

    }

    // loadData({ fecha_inicio, fecha_fin }) {
    loadData() {
        SSocket.sendPromise({
            component: "board",
            type: "principal",
            // fecha_inicio: fecha_inicio,
            // fecha_fin: fecha_fin
        }).then(e => {
            if (!e.data) return;
            this.setState({ data: e.data })
            // SSocket.sendPromise({
            //     component: "company",
            //     type: "getReporteGeneral",
            //     key_company: this.pk,
            //     fecha_inicio: fecha_inicio,
            //     fecha_fin: fecha_fin
            // }).then(f => {
            //     if (!f.data) return;
            //     this.setState({ data: f.data })
            // })
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
            es: "Reporte Principal",
            en: "Company Report"
        }} disableScroll>
            {/* <FiltroEntreFechas type='mes' onChange={(evt) => {
                this.loadData(evt)
            }} /> */}
            <SText onPress={() => { this.loadData() }}>{"Recargar"}</SText>
            <SView col={"xs-12"} flex>
                <STable2
                    data={this.state.data}
                    cellStyle={{
                        padding: 2,
                        overflow: 'hidden',
                    }}
                    header={[
                        { key: "index", label: "#", width: 20 },
                        // { key: "key_usuario", label: "ku", width: 300 },
                        {
                            key: "company/key", label: SLanguage.select({
                                en: "Photo",
                                es: "Foto"
                            }), width: 30, component: (key) => <SView card width={25} height={25} center
                                style={{ borderRadius: 4, overflow: "hidden" }}>
                                <SImage enablePreview src={SSocket.api.root + "company/" + key} style={{
                                    resizeMode: "cover",
                                }} /></SView>
                        },
                        {
                            key: "company/descripcion", label: SLanguage.select({
                                en: "Company",
                                es: "Compañía"
                            }), width: 120,
                            cellStyle: {
                                fontWeight: "bold"
                            },
                            onPress: (val, obj) => {
                                SNavigation.navigate("/company/profile", { pk: obj.company.key })
                            },
                        },
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
                            key: "cliente/descripcion", label: SLanguage.select({
                                en: "Client",
                                es: "Cliente",
                            }), width: 120,
                            cellStyle: {
                                fontWeight: "bold"
                            },
                            onPress: (val, obj) => {
                                SNavigation.navigate("/cliente/profile", { pk: obj.cliente.key })
                            }

                        },
                        {
                            key: "evento/descripcion", label: SLanguage.select({
                                en: "Event",
                                es: "Evento"
                            }), width: 150,
                            cellStyle: {
                                fontWeight: "bold"
                            },
                            onPress: (val, obj) => {
                                SNavigation.navigate("/company/event", { key_evento: obj.evento.key })
                            }
                        },
                        {
                            key: "staff_tipo/descripcion", label: SLanguage.select({
                                en: "Staff",
                                es: "Staff"
                            }), width: 150
                        },
                        {
                            key: "staff/descripcion", label: SLanguage.select({
                                en: "Staff Description",
                                es: "Descripción staff"
                            }), width: 150,
                            onPress: (val, obj) => {
                                SNavigation.navigate("/staff/add", { pk: obj.staff.key })
                            }
                        },
                        {
                            key: "-state", label: SLanguage.select({
                                en: "End",
                                es: "Fin"
                            }), center: true, width: 60,
                            render: (o) => {
                                const fecha_inicio = o?.staff?.fecha_inicio;
                                const fecha_fin = o?.staff?.fecha_fin;
                                if (!fecha_inicio || !fecha_fin) return "ERROR"
                                const fecha_inicio_time = new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").getTime();
                                const fecha_fin_time = new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").getTime();
                                if (fecha_inicio_time > fecha_fin_time) {
                                    return "ERROR"
                                }
                                if (fecha_inicio_time > new Date().getTime()) {
                                    return "PENDING"
                                }
                                if (fecha_fin_time < new Date().getTime()) {
                                    return "FINISHED"
                                }
                                return "READY"
                            },
                            component: (o) => {
                                let color = STheme.color.primary;
                                switch (o) {
                                    case "ERROR":
                                        color = STheme.color.danger;
                                        break;
                                    case "PENDING":
                                        color = STheme.color.warning;
                                        break;
                                    case "FINISHED":
                                        color = STheme.color.success;
                                        break;
                                    case "READY":
                                        color = STheme.color.primary;
                                        break;
                                }

                                return <SView padding={2} center style={{
                                    backgroundColor: color,
                                    borderRadius: 4,
                                }}>
                                    <SText bold fontSize={10}>{o}</SText>
                                </SView>
                            }
                        },
                        {
                            key: "evento/fecha", order: "desc", orderType: "date", label: SLanguage.select({
                                en: "Date",
                                es: "Fecha"
                            }), width: 120,
                            component: a => <SText fontSize={10} col={"xs-12"} style={{ textAlign: "right", padding: 4, }}>{new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy")}</SText>
                        },

                        {
                            key: "staff/fecha_inicio", label: SLanguage.select({
                                en: "Start",
                                es: "Inicio"
                            }), center: true, width: 60,
                            render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                        },
                        {
                            key: "staff/fecha_fin", label: SLanguage.select({
                                en: "End",
                                es: "Fin"
                            }), center: true,
                            width: 60,
                            render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                        },
                        {
                            key: "-diffTime", label: SLanguage.select({
                                en: "Diff",
                                es: "Falta"
                            }), center: true, width: 100,
                            render: (o) => {
                                const fecha_inicio = o?.staff?.fecha_inicio;
                                const fecha_fin = o?.staff?.fecha_fin;
                                if (!fecha_inicio || !fecha_fin) return "ERROR"

                                const fecha_inicio_time = new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD")
                                // fecha_fin_time.language = SLanguage.getLanguage();
                                if (fecha_inicio_time.getTime() < new Date().getTime()) {
                                    return fecha_inicio_time.timeSince(new SDate()) + " Ago"
                                }
                                const fecha_fin_time = new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ssTZD")
                                const info = new SDate().timeSince(fecha_inicio_time);
                                return "" + info
                            },

                        },
                        {
                            key: "staff", width: 50, label: SLanguage.select({
                                en: "Build",
                                es: "Construir"
                            }),
                            component: (e) => <SView padding={3} width={30} height={30}  ><SIcon name='confStaff' fill={STheme.color.text} /></SView>,
                            onPress: (staff) => { SNavigation.navigate("/staff/users", { pk: staff.key }) }
                        },
                        {
                            key: "staff/cantidad", label: SLanguage.select({
                                en: "Staff Amount",
                                es: "Cantidad Staff"
                            }), width: 80, center: true
                        },

                    ]}
                />
            </SView>
        </SPage>
    }
}
export default connect(reportCompany);