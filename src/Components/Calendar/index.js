import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SView, STheme, SImage, SInput, SLoad, SButtom, SIcon, SWebView, STable2, SMath, SDate, SList2, SScrollView2, SLanguage } from 'servisofts-component';
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
        let color = isSelect ? STheme.color.white : STheme.color.white
        
        const isCurtMonth = this.state.curDay.toString("yyyy-MM") == data.sdate.toString("yyyy-MM")
        let events = [];
        if(this.state.data){
            events = this.state.data.filter(a=> new SDate(a.fecha, "yyyy-MM-ddThh:mm:ss").equalDay(data.sdate))
        }
        let datosArray = data?.dataAsis
        return <>
            <SView col={"xs-1.7"} height={100} style={{
                borderWidth: 1, borderColor: STheme.color.gray,
                opacity: isCurtMonth ? 1 : 0.4,
                // backgroundColor:  data.asistiendo ? "#D93444": STheme.color.card
                backgroundColor: STheme.color.card
            }} center

            >
                {/* {data?.evento ? null : <Degradado />}
                {data?.isPaquete ? <SView style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: 10,
                    backgroundColor: "#D70201"
                }}></SView> : null} */}
                <SText style={{
                    position: "absolute", right: 4, top: 4
                }} bold font={"Roboto"} fontSize={14} color={STheme.color.text}>{data.sdate.toString("dd")}</SText>
                {events ? events.map((k) => {
                    let desCorto = k.descripcion.length > 10 ? k.descripcion.substring(0, 10) + "..." : k.descripcion
                    return (<>
                        <SView col={"xs-11.5"} row center style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: STheme.color.success,
                            padding: 1.5,
                            marginTop: 4,
                            overflow: "hidden",
                            backgroundColor: STheme.color.gray
                        }} onPress={() => {
                            SNavigation.navigate("/evento", { key: k?.key })
                        }}>
                            {/* <Degradado /> */}
                            <SView width={20} height={20} card style={{ borderRadius: 45, overflow: 'hidden', borderWidth: 1, borderColor: STheme.color.darkGray }}>
                                <SImage src={SSocket.api.root + "company/" + k?.key_company} style={{
                                    resizeMode: "cover",
                                }} />
                            </SView>
                            <SView width={3} />
                            <SView >
                                <SText font={"Roboto"} center fontSize={10} color={color}>{desCorto || ""}</SText>
                            </SView>
                        </SView>
                    </>)
                }) : null}
                <SHr />
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
        let dataEventos = this.state.data || []
        // console.log("dataEventos")
        // console.log(dataEventos)

        let primerDiaSemana = new Date(ano, mes, 1).getDay();
        let fechaFin = new Date(ano, mes + 1, 1);
        fechaFin = fechaFin.setDate(fechaFin.getDate() - 1);
        let ultimoDiaSemana = new Date(fechaFin).getDay();
        let ultimoDiaMes = new Date(fechaFin).getDate()
        var dataAsistencia = this.state.data;

        // if (!dataAsistencia) return null;
        dataAsistencia = dataAsistencia || {};

        let calendario = [];
        var index = 0;
        var diaMes = 0;
        var asisti = false;
        var data;
        var dato;
        var dataMostrar = [];

        // for (let i = 0; i < 6; i++) {
        //     for (let j = 0; j < 7; j++) {
        //         index++;
        //         if (i == 0 && j < primerDiaSemana) {
        //             //primer semana del mes
        //             calendario.push({ index, dia_semana: j, semana: i, fecha: null })
        //         } else {
        //             if (diaMes < ultimoDiaMes) {
        //                 diaMes++;
        //                 //Aqui verificamos si asistio o no a entrenar

        //                 let fechaActual = new Date(ano, mes, diaMes)
        //                 let asistido;
        //                 // let asistio = Object.values(dataAsistencia).find(obj2 => obj2.fecha_on == fechaActual);
        //                 let sdActual = new SDate(fechaActual);
        //                 // Object.values(dataAsistencia).map((obj) => {
        //                 Object.values(dataEventos).map((obj) => {
        //                     // dato = Object.values(obj).find(obj2 => new SDate(obj2.fecha_on).toString("yyyy-MM-dd") == new SDate(fechaActual).toString("yyyy-MM-dd"));
        //                     // if (!dato) return null

        //                     // let formatFecha = new Date(obj.fecha_on)

        //                     // asistido = Object.values(obj).filter((a) => new SDate(a.fecha_on).toString("yyyy-MM-dd") == new SDate(fechaActual).toString("yyyy-MM-dd"))
        //                     if (new SDate(obj.fecha).toString("yyyy-MM-dd") == sdActual.toString("yyyy-MM-dd")) {
        //                         console.log("yes")
        //                         asisti = true
        //                         data = obj;
        //                         dataMostrar.push(obj)

        //                     }
        //                 })

        //                 let isPaquete = false;
        //                 // Object.values(this.state.paquetes).map((obj) => {

        //                 // Object.values(dataEventos).map((obj) => {
        //                 //     if ((new SDate(obj.fecha_inicio, "yyyy-MM-dd").equalDay(sdActual) || new SDate(obj.fecha_fin, "yyyy-MM-dd").equalDay(sdActual)) || (
        //                 //         sdActual.isAfter(new SDate(obj.fecha_inicio, "yyyy-MM-dd")) && sdActual.isBefore(new SDate(obj.fecha_fin, "yyyy-MM-dd"))
        //                 //     )) {
        //                 //         isPaquete = true;

        //                 //     }
        //                 // })


        //                 calendario.push({ isPaquete: isPaquete, diaMes, index, dia_semana: j, semana: i, fecha: "", asistiendo: asisti, dataAsis: dataMostrar, evento: dataMostrar[0] })
        //                 asisti = false
        //                 data = null;
        //                 dataMostrar = []
        //             } else {
        //                 asisti = false
        //                 data = null;
        //                 dataMostrar = []
        //                 calendario.push({ index, dia_semana: j, semana: i, fecha: null })
        //             }
        //             // index++;
        //         }
        //     }
        // }

        // console.log("calendario")
        // console.log(calendario)
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
        var usuario = Model.usuario.Action.getUsuarioLog();
        if (!usuario) return <SLoad />
        return <SView col={"xs-12"} row>
            <SText bold fontSize={22} language={{
                es: "¡Hola " + usuario.Nombres + "!",
                en: "Hello " + usuario.Nombres + "!"
            }} />
            <SHr height={15} />
            {this.getCalendario()}
        </SView>
    }
    render() {
        return (<>
            {this.getBody()}
            <SHr height={40} />
        </>
        );
    }

    footer() {
        return <BottomNavigator url={"/perfil"} />
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);