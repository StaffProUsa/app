import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { SImage, SList2, SPage, SText, STheme, SView, SLanguage, SHr, SIcon, SDate, SNavigation, SLoad, SUtil } from 'servisofts-component';
import { Container } from '../Components';
import Degradado from '../Components/Degradado';
import PBarraFooter from '../Components/PBarraFooter';
import Card from 'servisofts-component/img/Card';
import { SelectEntreFechas } from '../Components/Fechas';

export default class history extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))



        // SSocket.sendPromise({
        //     component: "staff_usuario",
        //     type: "getTrabajosProximos",
        //     key_usuario: Model.usuario.Action.getKey()
        // }).then(e => {
        //     this.setState({ data: e.data })
        // }).catch(e => {
        //     console.error(e);
        // })

    }


    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    loadData({ fecha_inicio, fecha_fin }) {
        SSocket.sendPromise({
            component: "staff_usuario",
            // type: "getMisTrabajos",
            type: "getMisTrabajosEntreFechas",
            key_usuario: Model.usuario.Action.getKey(),
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin
        }).then(e => {
            Object.values(e.data).map((obj) => {
                const f = new SDate(obj.evento.fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd")
                const hi = new SDate(obj.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
                const hf = new SDate(obj.staff.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
                obj._fecha_inicio = f + "T" + hi
                if (obj.staff.fecha_fin) {
                    obj._fecha_fin = f + "T" + hf
                }

            })
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })


        SSocket.sendPromise({
            component: "staff_usuario",
            // type: "getHistorico",
            type: "getHistoricoEntreFechas",
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            this.setState({ dataResumen: e.data })
        }).catch(e => {
            console.error(e);
        })
    }

    getPerfil() {
        var usuario = Model.usuario.Action.getUsuarioLog();
        // if (!usuario) {
        //   SNavigation.navigate('login');
        //   return <SView />;
        // }
        return (
            <SView
                center
                onPress={() => {
                    SNavigation.navigate('/perfil/editar');
                }}>
                <SView
                    style={{
                        width: 140,
                        height: 140,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <SView
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: STheme.color.card,
                            borderRadius: 100,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: STheme.color.card
                        }}>
                        <SImage
                            src={`${SSocket.api.root}usuario/${usuario.key
                                }?time=${new Date().getTime()}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: "cover"
                            }}
                        />
                    </SView>
                </SView>
                <SHr />
                <SView>
                    <SView center>
                        <SText
                            style={{
                                // flex: 5,
                                fontSize: 18,
                                // fontWeight: "bold",
                                color: STheme.color.text
                            }}>
                            {usuario['Nombres'] + ' ' + usuario['Apellidos']}{' '}
                        </SText>
                    </SView>
                    <SView center>
                        <SText
                            style={{
                                fontSize: 14
                                // color: "#bbb"
                            }}
                            color={STheme.color.gray}>
                            {usuario['Correo'] ?? '--'}{' '}
                        </SText>
                    </SView>
                </SView>
            </SView>
        );
    }
    getList() {
        return <SList2
            data={this.state.data}
            order={[{ key: "_fecha_inicio", order: "desc" }]}
            // filter={(obj) => {
            //     if (obj.staff.fecha_inicio == null) return false;
            //     if (obj.staff.fecha_fin == null) return false;
            //     let fi = new SDate(obj.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD")
            //     let ff = new SDate(obj.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD")
            //     let fecha_inicio = new SDate(this.state.fecha_inicio, "yyyy-MM-dd")
            //     let fecha_fin = new SDate(this.state.fecha_fin, "yyyy-MM-dd")
            //     if (ff.getTime() < fecha_inicio.getTime()) return false;
            //     if (fi.getTime() > fecha_fin.getTime()) return false;
            //     // if (fs.getTime() > fecha_fin.getTime()) return false;

            //     return true;
            // }}
            render={(obj) => {
                let isInvitation = (obj?.staff_usuario?.estado == 2)
                let userCoordinador = Model.usuario.Action.getByKey(obj?.staff_usuario?.key_usuario_atiende)
                console.log("obj", obj)
                console.log("userCoordinador", userCoordinador)
                let timeWork;
                let subtotal;

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
                    console.log("fecha_ingreso", obj.fecha_ingreso)
                    let fi = new SDate(obj.fecha_ingreso, "yyyy-MM-ddThh:mm:ss.sssTZD")
                    let fs = obj.fecha_salida ? new SDate(obj.fecha_salida, "yyyy-MM-ddThh:mm:ss.sssTZD") : new SDate()
                    let disf = fi.diffTime(fs);
                    console.log("disf", disf)
                    timeWork = ((disf / 1000) / 60 / 60)
                    subtotal = (timeWork * (obj?.salario_hora ?? 0))
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
                        // SNavigation.navigate("/evento", { key: obj?.evento?.key })
                        console.log(obj)
                        SNavigation.navigate("/cd", { key_staff_usuario: obj?.key })
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
                        <SView col={"xs-12"} row >
                            <SView col={"xs-5.5"} style={{ alignItems: "flex-end" }}>
                                <SText fontSize={14} style={{
                                    backgroundColor: STheme.color.success,
                                    color: STheme.color.white,
                                    padding: 4,
                                    borderRadius: 4
                                }} language={{
                                    es: "T. de trabajo: " + timeWork.toFixed(2) + " hrs.",
                                    en: "Working time: " + timeWork.toFixed(2) + " hrs."
                                }} />
                            </SView>
                            <SView flex />
                            <SView col={"xs-5.5"} style={{ alignItems: "flex-end" }}>
                                <SText fontSize={14} style={{
                                    backgroundColor: STheme.color.warning,
                                    color: STheme.color.white,
                                    padding: 4,
                                    borderRadius: 4
                                    // borderRadius: 10
                                }} language={{
                                    es: "Monto ganado: " + subtotal.toFixed(2) + " $",
                                    en: "Amount earned: " + subtotal.toFixed(2) + " $"
                                }} />
                            </SView>
                        </SView>
                    </> : null}
                </SView>
            }} />
    }
    CardResumen({ title, value, color, icon, onPress, params, option }) {
        return <SView col={"xs-4"} row style={{ paddingRight: 5, paddingBottom: 5 }} onPress={() => {
            if (onPress) {
                SNavigation.navigate(onPress, params)
            }
        }}>
            <SView col={"xs-12"} row style={{
                borderWidth: 1,
                borderColor: STheme.color.lightGray,
                borderRadius: 16,
                overflow: "hidden",
            }}>
                <Degradado />
                <SView col={"xs-12"} padding={10}>
                    <SText fontSize={18} color={STheme.color.text}>
                        {title}
                    </SText>
                </SView>

                <SView col={"xs-8"} center padding={10}>
                    <SText fontSize={30} center>
                        {value}
                    </SText>
                </SView>
                <SView col={"xs-4"} center style={{
                    backgroundColor: color,
                    borderBottomLeftRadius: 50,
                    borderTopLeftRadius: 50,
                }}>
                    <SIcon name={icon} fill={STheme.color.white} width={30} />
                </SView>
            </SView>
        </SView>
    }



    getResumen() {
        // if (!this.state.dataResumen) return <SLoad/>
        const { eventos, eventos_asistidos, eventos_completados, eventos_no_asistidos } = this.state.dataResumen ?? {}
        return <>
            <SView col={"xs-12"} row>
                <this.CardResumen onPress={"/history/timesheet"} params={this.entrefecha} title={SLanguage.select({ es: "Total eventos", en: "Total events" })} value={eventos} color={"#35A1C3"} icon={"hisEvent"} />
                <this.CardResumen onPress={"/history/timesheet"} params={{
                    ...this.entrefecha,
                    state: ["FINISHED"]
                }} title={SLanguage.select({ es: "Eventos no asistidos", en: "Unattended events" })} value={eventos_no_asistidos} color={STheme.color.danger} icon={"noAsistido"} />
                <this.CardResumen onPress={"/history/timesheet"} params={{
                    ...this.entrefecha,
                    state: ["COMPLETED"]
                }} title={SLanguage.select({ es: "Eventos completados", en: "Completed events" })} value={eventos_completados} color={"#33BE5B"} icon={"hisCompleted"} />
                {/* <this.CardResumen onPress={"/history/timesheet"} option={1} title={SLanguage.select({ es: "Eventos asistidos", en: "Events attended" })} value={eventos_asistidos} color={STheme.color.warning} icon={"asistido"} /> */}
            </SView>
        </>
    }


    render() {
        return <SPage titleLanguage={{ es: "Mi historial", en: "My history" }} footer={<PBarraFooter url={'/trabajos'} />}>
            <Container>
                {this.getPerfil()}
                <SHr height={25} />
                <SelectEntreFechas
                    fecha_inicio={new SDate().setDay(1).toString("yyyy-MM-dd")}
                    onChange={e => {
                        this.entrefecha = e;
                        this.loadData(e)
                        // this.setState({ fecha_inicio: e.fecha_inicio, fecha_fin: e.fecha_fin })
                    }}
                />
                <SHr height={25} />
                {this.getResumen()}
                {/* {this.getTrabajos()} */}
                <SHr height={25} />
                {this.getList()}
                <SHr height={90} />
            </Container>
        </SPage >
    }
}
