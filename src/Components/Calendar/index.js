import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SNavigation, SPage, SText, SView, STheme, SImage, SInput, SLoad, SButtom, SIcon, SWebView, STable2, SMath, SDate, SList2, SScrollView2 } from 'servisofts-component';
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

    componentDidMount() {


        // Model.asistencia.Action.getByKeyUsuario().then(resp => {
        //     this.setState({ data: resp.data })
        // }).catch(e => {

        // })

        // Model.paquete_venta.Action.getAllByUsuario().then(resp => {
        //     this.setState({ paquetes: resp.data })
        // }).catch(e => {

        // })


    }

    renderDias(data, i) {
        let hoy = new SDate(this.state.curDay).getDayOfWeek()
        let isSelect = false
        let color = isSelect ? STheme.color.white : STheme.color.text
        // console.log(data.asistiendo)
        let datosArray = data?.dataAsis
        return <>
            <SView col={"xs-1.7"} height={90} style={{
                borderWidth: 1, borderColor: STheme.color.gray,
                // backgroundColor:  data.asistiendo ? "#D93444": STheme.color.card
                // backgroundColor: STheme.color.card
            }} center >
                <Degradado/>
                {data?.isPaquete ? <SView style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: 10,
                    backgroundColor: "#D70201"
                }}></SView> : null}
                {data?.paquete ?
                    <SView col={"xs-12"} flex style={{
                        alignItems: "flex-end",
                        position: "absolute",
                        top: 0
                    }}>
                        <SView width={20} height={20} card style={{ borderRadius: 45, overflow: 'hidden', }}>
                            <SImage src={SSocket.api.root + "paquete/" + data?.paquete?.key_paquete} />
                        </SView>
                    </SView>
                    : null
                }
                <SText font={"Roboto"} fontSize={14} color={color}>{data?.diaMes || ""}</SText>
                <SView col={"xs-12"} row center>
                    {data?.dataAsis ? data.dataAsis.map((k) => {
                        return (
                            <SView style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: "#D93444",
                                padding: 2
                            }} width={32} >
                                <SText font={"Roboto"} fontSize={10} color={color}>{k.horario || ""}</SText>
                            </SView>
                        )
                    })
                        : null}
                </SView>
                <SHr />

            </SView>
        </>
    }

    getCabecera() {
        return <>
            <SView col={"xs-12"} row >
                <Dia dia="DOM" />
                <Dia dia="LUN" />
                <Dia dia="MAR" />
                <Dia dia="MIE" />
                <Dia dia="JUE" />
                <Dia dia="VIE" />
                <Dia dia="SAB" />
            </SView>
        </>
    }

    getCalendario(mes, ano) {

        // if (!this.state?.paquetes) return <SLoad />
        this.state.paquetes = this.state.paquetes || {}

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

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                index++;
                if (i == 0 && j < primerDiaSemana) {
                    //primer semana del mes
                    calendario.push({ index, dia_semana: j, semana: i, fecha: null })
                } else {
                    if (diaMes < ultimoDiaMes) {
                        diaMes++;
                        //Aqui verificamos si asistio o no a entrenar

                        let fechaActual = new Date(ano, mes, diaMes)
                        let asistido;
                        // let asistio = Object.values(dataAsistencia).find(obj2 => obj2.fecha_on == fechaActual);
                        let sdActual = new SDate(fechaActual);
                        Object.values(dataAsistencia).map((obj) => {
                            // dato = Object.values(obj).find(obj2 => new SDate(obj2.fecha_on).toString("yyyy-MM-dd") == new SDate(fechaActual).toString("yyyy-MM-dd"));
                            // if (!dato) return null

                            // let formatFecha = new Date(obj.fecha_on)

                            // asistido = Object.values(obj).filter((a) => new SDate(a.fecha_on).toString("yyyy-MM-dd") == new SDate(fechaActual).toString("yyyy-MM-dd"))
                            if (new SDate(obj.fecha_on).toString("yyyy-MM-dd") == sdActual.toString("yyyy-MM-dd")) {
                                console.log("yes")
                                asisti = true
                                data = obj;
                                dataMostrar.push(obj)

                            }
                        })

                        let isPaquete = false;
                        Object.values(this.state.paquetes).map((obj) => {
                            if ((new SDate(obj.fecha_inicio, "yyyy-MM-dd").equalDay(sdActual) || new SDate(obj.fecha_fin, "yyyy-MM-dd").equalDay(sdActual)) || (
                                sdActual.isAfter(new SDate(obj.fecha_inicio, "yyyy-MM-dd")) && sdActual.isBefore(new SDate(obj.fecha_fin, "yyyy-MM-dd"))
                            )) {
                                isPaquete = true;
                                // asisti = true
                                // data = obj;
                                // dataMostrar.push(obj)
                            }
                        })


                        calendario.push({ isPaquete: isPaquete, diaMes, index, dia_semana: j, semana: i, fecha: "", asistiendo: asisti, dataAsis: dataMostrar, paquete: dataMostrar[0] })
                        asisti = false
                        data = null;
                        dataMostrar = []
                    } else {
                        asisti = false
                        data = null;
                        dataMostrar = []
                        calendario.push({ index, dia_semana: j, semana: i, fecha: null })
                    }
                    // index++;
                }
            }
        }

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
                    this.setState({ curDay: this.state.curDay.addMonth(-1) })
                }}>
                    <SIcon name='Iprevious' height={20} fill={STheme.color.secondary} />
                </SView>
                <SView col={"xs-8"} center height={55}>
                    <SHr />
                    <SText fontSize={18} bold style={{ color: STheme.color.white }}>{this.state.curDay.toString("MONTH, yyyy")}</SText>
                    <SHr />
                </SView>
                <SView col={"xs-2"} onPress={() => {
                    this.setState({ curDay: this.state.curDay.addMonth(1) })
                }}>
                    <SIcon name='Inext' height={20} fill={STheme.color.secondary} />
                </SView>
            </SView>
            {this.getCabecera()}
            <SView col={"xs-12"} row center>
                <SList2
                    horizontal
                    space={0}
                    // data={new Array(SDate.getDaysInMonth(this.state.curDay.getYear(), this.state.curDay.getMonth())).fill(0)}
                    data={calendario}
                    render={this.renderDias.bind(this)}
                />
            </SView>
        </>
    }
    getBody() {
        var usuario = Model.usuario.Action.getUsuarioLog();

        if (!usuario) return <SLoad />
        //asistencia
        //getByKeyUsuario
        return <SView col={"xs-12"} row>
            <SText bold fontSize={22}>
                Hola, {usuario.Nombres}
            </SText>
            <SHr height={15} />
            {/* <MiPlan data={usuario} onLoad={(data) => {
                this.setState({ paquetes: data })
            }} /> */}
            <SHr height={15} />
            {this.getCalendario(this.state.curDay.getMonth() - 1, this.state.curDay.getYear())}
        </SView>
    }
    render() {
        return (<>
            {/* <Container> */}
            {this.getBody()}
            {/* </Container> */}
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