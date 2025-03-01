import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SNavigation, SPage, STable2, SText, STheme, SView, SLanguage, SHr, SList2, SImage, SUtil, SLoad } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import InputFecha from '../Components/NuevoInputs/InputFecha';
import { Container } from '../Components';
import FiltroEntreFechas from '../Components/Filtros/FiltroEntreFechas';
import { MenuButtom } from 'servisofts-rn-roles_permisos';

export default class historyDetail extends Component {
    constructor(props) {
        super(props);
        const defaultFechaInicio = new SDate()
        const defaultFechaFin = new SDate()

        // if (props.type == "mes") {
        defaultFechaInicio.setDay(1);
        // }
        this.state = {
            data: {},
            fecha_inicio: SNavigation.getParam("fecha_inicio", defaultFechaInicio.toString("yyyy-MM-dd")),
            fecha_fin: SNavigation.getParam("fecha_inicio", defaultFechaFin.toString("yyyy-MM-dd")),
            load: false
        };
        // this.state = {
        //     data: {},
        //     fecha_inicio: SNavigation.getParam("fecha_inicio", new SDate().toString("yyyy-MM-dd")),
        //     fecha_fin: SNavigation.getParam("fecha_inicio", new SDate().toString("yyyy-MM-dd"))
        // };
        this.key_cliente = SNavigation.getParam("pk");
        this.option = SNavigation.getParam("option");
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))

        // SSocket.sendPromise({
        //     component: "staff_usuario",
        //     type: "reporteHorasCliente",
        //       key_cliente: this.key_cliente,
        //     fecha_inicio: this.state.fecha_inicio,
        //     fecha_fin: this.state.fecha_fin
        // }).then((e) => {
        //     this.setState({ data: e.data })
        // }).catch(e => {

        // })

        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getMisTrabajosEntreFechas",
            key_usuario: Model.usuario.Action.getKey(),
            fecha_inicio: this.state.fecha_inicio,
            fecha_fin: this.state.fecha_fin
        }).then(e => {

            this.state.load = true

            Object.values(e.data).map((obj) => {
                const f = new SDate(obj.evento.fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd")
                const hi = new SDate(obj.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
                const hf = new SDate(obj.staff.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
                obj._fecha_inicio = f + "T" + hi
                if (obj.staff.fecha_fin) {
                    obj._fecha_fin = f + "T" + hf
                }

            })

            if (this.option == 1) {

                this.setState({
                    data: Object.fromEntries(
                        Object.entries(e.data).filter(([key, value]) => value.fecha_ingreso !== null && value.fecha_salida === null))
                })
            } else if (this.option == 2) {
                this.setState({
                    data: Object.fromEntries(
                        Object.entries(e.data).filter(([key, value]) => value.fecha_ingreso === null))
                })
            } else if (this.option == 3) {
                this.setState({
                    data: Object.fromEntries(
                        Object.entries(e.data).filter(([key, value]) => value.fecha_ingreso !== null && value.fecha_salida !== null))
                })
            } else {
                this.setState({ data: e.data })
            }
            // this.setState({ data: e.data })

        }).catch(e => {
            console.error(e);
        })


    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    getList() {
        return <SList2 data={this.state.data} order={[{ key: "_fecha_inicio", order: "desc" }]} render={(obj) => {
            let isInvitation = (obj?.staff_usuario?.estado == 2)
            let userCoordinador = Model.usuario.Action.getByKey(obj?.staff_usuario?.key_usuario_atiende)
            // console.log("obj", obj)
            // console.log("userCoordinador", userCoordinador)
            let timeWork;

            let asistencia = STheme.color.danger + "66"
            let mensaje = SLanguage.select({
                es: "No asistió",
                en: "Did not attend"
            })

            if (obj.fecha_ingreso != null) {
                asistencia = STheme.color.warning + "66"
                mensaje = SLanguage.select({
                    es: "Asistió pero no completó",
                    en: "Attended but did not complete"
                })
            }

            if ((obj.fecha_ingreso != null) && (obj.fecha_salida != null)) {
                // console.log("fecha_ingreso", obj.fecha_ingreso)
                let fi = new SDate(obj.fecha_ingreso, "yyyy-MM-ddThh:mm:ss.sssTZD")
                let fs = obj.fecha_salida ? new SDate(obj.fecha_salida, "yyyy-MM-ddThh:mm:ss.sssTZD") : new SDate()
                let disf = fi.diffTime(fs);
                // console.log("disf", disf)
                timeWork = ((disf / 1000) / 60 / 60).toFixed(2);
                asistencia = STheme.color.success + "66";
                mensaje = SLanguage.select({
                    es: "Completado",
                    en: "Completed"
                })
            }

            return <SView col={"xs-12"} row padding={15} style={{
                borderRadius: 16,
                borderWidth: 2,
                borderColor: asistencia,
                overflow: "hidden",
            }} onPress={() => {
                if (isInvitation) {
                    SNavigation.navigate("/invitationDetail", { key: obj?.staff_usuario?.key })
                } else {
                    SNavigation.navigate("/evento", { key: obj?.evento?.key })
                }
            }}>
                <SView col={"xs-2"} row center>
                    <SView style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: STheme.color.lightGray,
                        overflow: "hidden",
                    }}>
                        <SImage src={require('../Assets/images/noImage.jpg')} style={{
                            resizeMode: "cover", position: "absolute"
                        }} />
                        <SImage src={SSocket.api.root + "company/" + obj?.cliente?.key_company} style={{
                            resizeMode: "cover", zIndex: 9
                        }} />

                    </SView>
                </SView>
                <SView col={"xs-10"} row>
                    <SView col={"xs-8"} >
                        <SText fontSize={14}>{obj?.cliente?.descripcion}</SText>
                        <SText fontSize={12} color={STheme.color.gray}>{obj?.staff_tipo?.descripcion}</SText>
                        <SText fontSize={10} color={STheme.color.gray}>{SUtil.limitString(obj?.staff?.descripcion, 120)}</SText>
                    </SView>
                    <SView col={"xs-4"} flex style={{ alignItems: "flex-end" }}>
                        <SText fontSize={14} padding={3} backgroundColor={asistencia} style={{ textAlign: "right" }} >{mensaje}</SText>
                    </SView>


                </SView>
                <SHr height={10} />
                <SHr height={1} color={STheme.color.lightGray} />
                <SHr height={10} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"dating"} fill={STheme.color.gray} width={12} />
                </SView>
                <SView col={"xs-10"} row >
                    <SText col={"xs-4"} style={{
                        borderRightWidth: 1,
                        borderRightColor: STheme.color.lightGray,
                    }} fontSize={12}>{new SDate(obj?.evento?.fecha).toString("MONTH dd, yyyy")}</SText>
                    {(obj?.staff?.fecha_inicio != null) ? <SText col={"xs-4"} style={{ paddingLeft: 3 }} fontSize={12} language={{
                        es: "Inicio: " + new SDate(obj?.staff?.fecha_inicio).toString("HH"),
                        en: "Start: " + new SDate(obj?.staff?.fecha_inicio).toString("HH"),
                    }} /> : null}
                    {(obj?.staff?.fecha_fin != null) ? <SText col={"xs-4"} fontSize={12} language={{
                        es: "Fin: " + new SDate(obj?.staff?.fecha_fin).toString("HH"),
                        en: "End: " + new SDate(obj?.staff?.fecha_fin).toString("HH"),
                    }} /> : null}
                </SView>
                <SHr height={10} />
                <SHr height={1} color={STheme.color.lightGray} />
                <SHr height={10} />
                <SView col={"xs-12"} row>
                    <SText col={"xs-6"} fontSize={12} style={{
                        borderRightWidth: 1,
                        borderRightColor: STheme.color.lightGray,
                    }}>  {SLanguage.select({
                        es: "Ingreso: ",
                        en: "Clock In: "
                    })}
                        {!obj.fecha_ingreso ? "No" : new SDate(obj.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD").toString("yyyy MONTH dd, HH")}</SText>
                    <SText col={"xs-6"} style={{ paddingLeft: 3 }} fontSize={12}>{SLanguage.select({
                        es: "Salida: ",
                        en: "Clock Out: "
                    })} {!obj.fecha_salida ? "No" : new SDate(obj.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").toString("yyyy MONTH dd, HH")}</SText>
                </SView>
                {((obj.fecha_ingreso != null) && (obj.fecha_salida != null)) ? <>
                    <SHr height={10} />
                    <SHr height={1} color={STheme.color.lightGray} />
                    <SHr height={10} />
                    <SView col={"xs-12"} style={{ alignItems: "flex-end" }}>
                        <SText fontSize={18} style={{
                            backgroundColor: STheme.color.success,
                            color: STheme.color.white,
                            padding: 5,
                            // borderRadius: 10
                        }} language={{
                            es: "Tiempo de trabajo: " + timeWork,
                            en: "Working time: " + timeWork
                        }} />
                    </SView>
                </> : null}
            </SView>
        }} />
    }
    getResumen() {
        if (!this.state.load) return <SLoad />

        if (Object.keys(this.state.data).length === 0) return <SView col={"xs-12"} center>
            <SHr height={25} />
            <SView col={"xs-4"} style={{ borderRadius: 8, borderWidth: 1, borderColor: STheme.color.text }} center padding={15}>
                <SIcon name='alertaNoResult' width={40} fill={STheme.color.text} />
                <SText center col={"xs-12"} fontSize={18} padding={10} style={{
                    borderRadius: 10
                }} language={{
                    es: "No se encontraron resultados",
                    en: "No results found"
                }} />
            </SView>
        </SView>

        const fecha1 = new Date(this.state.fecha_inicio);
        const fecha2 = new Date(this.state.fecha_fin);

        // Diferencia en milisegundos
        const diferenciaMilisegundos = fecha2 - fecha1;

        // Convertir milisegundos a días
        const diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);


        if (this.option == 3 && Object.keys(this.state.data).length > 0) {
            return <SView col={"xs-12"} row center backgroundColor={STheme.color.success + "66"} style={{ borderRadius: 10 }}>
                <SHr height={20} />
                <SText center col={"xs-12"} fontSize={18} padding={10} style={{
                    borderRadius: 10
                }} language={{
                    es: "Resumen de asistencias",
                    en: "Attendance summary"
                }} />
                <SView col={"xs-12"} row center style={{
                    borderBottomWidth: 1,
                    borderBottomColor: STheme.color.white
                }} />
                <SView col={"xs-12"} center>
                    <SText fontSize={16} padding={10} language={{
                        es: "Días trabajados: " + diferenciaDias,
                        en: "Days worked: " + diferenciaDias
                    }} />
                </SView>

                <SView col={"xs-6"} center>
                    <SText fontSize={16} padding={10} language={{
                        es: "Total eventos: " + Object.keys(this.state.data).length,
                        en: "Total events: " + Object.keys(this.state.data).length
                    }} />
                </SView>
                <SView col={"xs-6"} center>
                    <SText fontSize={16} padding={10} language={{
                        es: "Total horas trabajadas: " + Object.values(this.state.data).reduce((a, b) => {
                            let fi = new SDate(b.fecha_ingreso, "yyyy-MM-ddThh:mm:ss.sssTZD")
                            let fs = b.fecha_salida ? new SDate(b.fecha_salida, "yyyy-MM-ddThh:mm:ss.sssTZD") : new SDate()
                            let disf = fi.diffTime(fs);
                            return a + ((disf / 1000) / 60 / 60)
                        }, 0).toFixed(2),
                        en: "Total hours worked: " + Object.values(this.state.data).reduce((a, b) => {
                            let fi = new SDate(b.fecha_ingreso, "yyyy-MM-ddThh:mm:ss.sssTZD")
                            let fs = b.fecha_salida ? new SDate(b.fecha_salida, "yyyy-MM-ddThh:mm:ss.sssTZD") : new SDate()
                            let disf = fi.diffTime(fs);
                            return a + ((disf / 1000) / 60 / 60)
                        }, 0).toFixed(2)
                    }} />
                </SView>
            </SView>
        }
    }

    render() {
        const users = Model.usuario.Action.getAll() ?? {};
        console.log(this.state.fecha_inicio)
        console.log(this.state.fecha_fin)
        console.log(this.option)

        console.log("dataaaaa", this.state.data)
        return <SPage titleLanguage={{
            en: "Attendace Report",
            es: "Reporte de horas trabajadas"
        }} >
            <SHr />
            <SView row col={"xs-12"} center>
                <SText language={{
                    en: "FROM:",
                    es: "DESDE:"
                }} />
                <SView width={4} />
                <InputFecha ref={ref => this.inpFechaInicio = ref}
                    defaultValue={this.state.fecha_inicio}
                />
                <SView width={8} />
                <SText language={{
                    en: "TO:",
                    es: "HASTA:"
                }} />
                <SView width={4} />
                <InputFecha ref={ref => this.inpFechaFin = ref}
                    defaultValue={this.state.fecha_fin}
                />
                <SView width={8} />

                <SView width={4} />
                <SView padding={5} card onPress={() => {
                    this.state.fecha_inicio = this.inpFechaInicio.getValue();
                    this.state.fecha_fin = this.inpFechaFin.getValue();
                    this.componentDidMount();
                }} style={{
                    backgroundColor: STheme.color.secondary
                }} row center>
                    <SIcon name='Search' width={18} fill={STheme.color.white} />
                    <SView width={4} />
                    <SText color={STheme.color.white} language={{
                        en: "SEARCH",
                        es: "BUSCAR"
                    }} />
                </SView>
            </SView>
            {/* <FiltroEntreFechas type='mes' onChange={(evt) => {
                this.loadData(evt)
            }} /> */}


            <Container>
                <SHr height={20} />
                {this.getResumen()}
                <SHr height={10} />
                <SView col={"xs-12"} style={{ alignItems: "flex-end" }}>
                    <SView row center onPress={()=>{

                    }}>
                        <SText language={{
                            en: "Report",
                            es: "Reporte"
                        }} />
                        <SView width={5} />
                        <SIcon name='Excel' height={30} width={30} />
                    </SView>
                </SView>
                {/* <MenuButtom label={SLanguage.select({ en: "Report", es: "Reporte" })} url='/company/profile/report' params={{ pk: this.pk }} icon={<SIcon name='Excel' height={30} />} /> */}
                <SHr height={10} />
                {this.getList()}
                <SHr height={30} />
            </Container>
        </SPage>
    }
}
