import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SView, STheme, SImage, SInput, SLoad, SButtom, SIcon, SWebView, STable2, SMath, SDate, SList2, SScrollView2, SLanguage, ScrollView } from 'servisofts-component';
import { WebView } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { AccentBar, BottomNavigator, Container, PButtom, Publicacion } from '..';
// import usuario_dato from '../../Model/tapeke/usuario_dato';
import Dia from './Dia';
import Degradado from '../Degradado';
// import MiPlan from './components/MiPlan';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nroPublicaciones: 0,
            curDay: new SDate(),
            data: null,
        };
    }

    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }

    crearSemana = (semana, sdate) => {
        return new Array(7).fill(0).map((obj, index) => {
            sdate.addDay(1);
            return {
                fecha: sdate.toString("yyyy-MM-dd"),
                sdate: sdate.clone(),
                dia: index
            }
        })
    }
    crearMes = (yyyymm) => {
        const mes = new SDate(yyyymm + "-01", "yyyy-MM-dd");
        // mes.setDay(1)
        mes.addDay(-mes.getDayOfWeek() - 1)
        console.log("mes", mes.toString(), mes.getDayOfWeek())
        let days = [];
        new Array(6).fill(0).map((obj, index) => {
            days = [...days, ...this.crearSemana(index, mes)]
        })
        return days;
    }
    componentDidMount() {
        const mes = this.crearMes(this.state.curDay.toString("yyyy-MM"));
        // this.state.mesdata = mes;
        this.setState({ mesdata: mes })
        // Model.asistencia.Action.getByKeyUsuario().then(resp => {
        //     this.setState({ data: resp.data })
        // }).catch(e => {

        // })

        // Model.paquete_venta.Action.getAllByUsuario().then(resp => {
        //     this.setState({ paquetes: resp.data })
        // }).catch(e => {

        // })
        SLanguage.addListener(this.onChangeLanguage.bind(this))

        SSocket.sendPromise({
            // component: "evento",
            // type: "getInicio",
            component: "evento",
            type: "getInicio",
            // limit: CANTIDAD_X_PAGE,
            // offset: this.state.page * CANTIDAD_X_PAGE,
            key_usuario: Model.usuario.Action.getKey(),
            fecha_inicio: "1993-01-01",
            fecha_fin: "2030-01-01"
        }).then(e => {
            this.setState({ data: e.data, })
        }).catch(e => {
            this.setState({ refreshing: false })
        })

    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }


    renderDias(data, i) {

        let hoy = new SDate(this.state.curDay).getDayOfWeek()
        let isSelect = false
        let color = isSelect ? STheme.color.primary : STheme.color.primary

        const isCurtMonth = this.state.curDay.toString("yyyy-MM") == data.sdate.toString("yyyy-MM")
        let events = [];
        if (this.state.data) {
            events = this.state.data.filter(a => new SDate(a.fecha, "yyyy-MM-ddThh:mm:ss").equalDay(data.sdate))
        }
        let isNow = this.state.curDay.equalDay(data.sdate)
        let datosArray = data?.dataAsis
        return <>
            <SView col={"xs-1.7"} colSquare style={{
                borderWidth: 1, borderColor: STheme.color.gray,
                opacity: isCurtMonth ? 1 : 0.4,
                // backgroundColor:  data.asistiendo ? "#D93444": STheme.color.card
                backgroundColor: STheme.color.card,
                justifyContent: "flex-end"
            }}

            >

                {/* {data?.evento ? null : <Degradado />}
                {data?.isPaquete ? <SView style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: 10,
                    backgroundColor: "#D70201"
                }}></SView> : null} */}

                <SView style={{
                    position: "absolute", right: 2, top: 2,
                    padding: 3,
                    ...isNow ? {
                        borderRadius: 100,
                        backgroundColor: STheme.color.secondary
                    } : {}
                }} center>
                    <SText bold center font={"Roboto"} fontSize={14}
                    color={(isNow) ? STheme.color.white : STheme.color.text}
                    // color={{
                    //     ...isNow ? STheme.color.white : STheme.color.white
                    // }}
                    >{data.sdate.toString("dd")}</SText>
                </SView>

                <SScrollView2  >
                    <SHr h={18} />
                    {events ? events.map((k) => {
                        let desCorto = k?.cliente?.descripcion.length > 15 ? k?.cliente?.descripcion.substring(0, 15) + "..." : k?.cliente?.descripcion
                        let isInvitation = (k?.staff_usuario?.estado == 2)
                        return (<>
                            <SView col={"xs-10"} row style={{
                                borderWidth: 2,
                                borderRadius: 4,
                                borderColor: isInvitation ? STheme.color.warning : STheme.color.success,
                                marginTop: 2,
                                padding: 1,
                                overflow: "hidden",
                                backgroundColor: STheme.color.gray
                            }} onPress={() => {
                                if (isInvitation) {
                                    SNavigation.navigate("/invitationDetail", { key: k?.staff_usuario?.key })
                                } else {
                                    SNavigation.navigate("/evento", { key: k?.key })
                                }

                            }}>
                                {/* <Degradado /> */}
                                {/* <SView width={20} height={20} card style={{ borderRadius: 45, overflow: 'hidden', borderWidth: 1, borderColor: STheme.color.darkGray }}>
                                <SImage src={SSocket.api.root + "company/" + k?.key_company} style={{
                                    resizeMode: "cover",
                                }} />
                            </SView> */}
                                {/* <SView width={3} /> */}
                                <SView >
                                    <SText bold font={"Roboto"} justify fontSize={11} color={color}>{desCorto || ""}</SText>
                                </SView>
                            </SView>
                        </>)
                    }) : null}
                </SScrollView2>
                <SHr h={2} />
            </SView>
        </>
    }

    getCabecera() {
        // VALIDANDO IDIOMA FORMULARIO
        let lenguaje = SLanguage.language;
        // lenguaje == "es" ? "D" : "S";
        return <>
            <SView col={"xs-12"} row >
                <Dia dia={lenguaje == "en" ? "MON" : "LUN"} />
                <Dia dia={lenguaje == "en" ? "TUE" : "MAR"} />
                <Dia dia={lenguaje == "en" ? "WED" : "MIE"} />
                <Dia dia={lenguaje == "en" ? "THU" : "JUE"} />
                <Dia dia={lenguaje == "en" ? "FRI" : "VIE"} />
                <Dia dia={lenguaje == "en" ? "SAT" : "SAB"} />
                <Dia dia={lenguaje == "en" ? "SUN" : "DOM"} />

            </SView>
        </>
    }

    getCalendario() {
        let mes = this.state.curDay.getMonth() - 1;
        let ano = this.state.curDay.getYear();
        // if (!this.state?.paquetes) return <SLoad />
        this.state.paquetes = this.state.paquetes || {}

        let fechaFin = new Date(ano, mes + 1, 1);
        fechaFin = fechaFin.setDate(fechaFin.getDate() - 1);

        console.log(this.state.curDay)
        return <>
            <SView col={"xs-12"} row
                center
                backgroundColor={STheme.color.secondary}
                style={{
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}
            >
                <SView col={"xs-2"} onPress={() => {
                    this.state.curDay.addMonth(-1)
                    const mes = this.crearMes(this.state.curDay.toString("yyyy-MM"));
                    this.state.mesdata = mes;
                    this.setState({ ...this.state })
                }}>
                    <SIcon name='Iprevious' height={20} fill={STheme.color.secondary} />
                </SView>
                <SView col={"xs-8"} center height={55}>
                    <SHr />
                    <SText fontSize={18} bold style={{ color: STheme.color.white }}>{this.state.curDay.toString("MONTH, yyyy")}</SText>
                    <SHr />
                </SView>
                <SView col={"xs-2"} onPress={() => {
                    this.state.curDay.addMonth(1)
                    const mes = this.crearMes(this.state.curDay.toString("yyyy-MM"));
                    this.state.mesdata = mes;
                    this.setState({ ...this.state })
                    // this.setState({ curDay: this.state.curDay.addMonth(1) })
                }}>
                    <SIcon name='Inext' height={20} fill={STheme.color.secondary} />
                </SView>
            </SView>
            <SView col={"xs-12"} center  >
                {this.getCabecera()}
                <SView col={"xs-12"} center>
                    <SList2
                        horizontal
                        space={0}
                        // data={new Array(SDate.getDaysInMonth(this.state.curDay.getYear(), this.state.curDay.getMonth())).fill(0)}
                        data={this.state.mesdata ?? []}
                        render={this.renderDias.bind(this)}
                    />
                </SView>
            </SView>
        </>
    }
    getBody() {
        // var usuario = Model.usuario.Action.getUsuarioLog();
        // if (!usuario) return <SLoad />
        return <SView col={"xs-12"} row>
            {/* <SText bold fontSize={22} language={{
                es: "¡Hola " + usuario.Nombres + "!",
                en: "Hello " + usuario.Nombres + "!"
            }} /> */}
            {/* <SHr height={15} /> */}
            {this.getCalendario()}
        </SView>
    }
    render() {
        return (<>
            {this.getBody()}
            {/* <SHr height={40} /> */}
        </>
        );
    }

}
export default index;