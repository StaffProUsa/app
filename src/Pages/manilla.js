import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SHr, SIcon, SNavigation, SNotification, SOrdenador, SPage, SText, STheme, SView } from 'servisofts-component';
import { Container } from '../Components';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import ItemEntrega from './venta/Components/ItemEntrega';
import PButtomFooter from '../Components/PButtomFooter';
import SVideo from '../Components/SVideo';
import ImageBlur from '../Components/ImageBlur';
import PFecha from '../Components/PFecha';

export default class manilla extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("key");
        this.key_ui = SNavigation.getParam("key_ui");
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "entrada",
            type: "getByKey",
            key: this.key,
        }).then(e => {
            this.setState({ data: e.data })
            SSocket.sendPromise({
                component: "actividad",
                type: "getAll",
                // key_evento: e.data.key_evento,
            }).then(f => {

                this.setState({ actividad: Object.values(f.data).filter((itm) => itm.key_evento == e.data.key_evento) })
                console.log("actividades", f.data)
            }).catch(e => {
                // SNotification.error(e.message)
                console.log("error", e)
            })

        }).catch(e => {

        })
    }

    handleCobrar() {
        if (!Model.usuario.Action.getKey()) {
            SNavigation.navigate("/login")
            return;
        }
        SSocket.sendPromise({
            component: "entrada",
            type: "aceptarInvitacion",
            key_entrada: this.key,
            key_usuario_invito: this.key_ui,
            key_participante: Model.usuario.Action.getKey(),
        }).then(e => {
            SNotification.send({
                title: "Exito",
                body: "Se cobro la entrada con exito",
                color: STheme.color.success,
                time: 5000,
            })
            SNavigation.replace("/entradas")
        }).catch(e => {
            SNotification.send({
                title: "Error",
                body: e?.error,
                color: STheme.color.danger,
                time: 5000,
            })
        })
    }

    getActividades(key_evento) {
        SSocket.sendPromise({
            component: "actividad",
            type: "getByKeyEvento",
            key_evento: key_evento,
        }).then(e => {
            this.setState({ actividades: e.data })
            console.log("actividades", e.data)
        }).catch(e => {
            SNotification.error(e.message)
        })
    }

    getFecha() {

        return (
            <>
                {/* <SView width={70} center height={125} style={{ top: 40, right: 0, position: "absolute", }} border={"transparent"} >
            <SIcon name={'BgDate'} fill={STheme.color.card} style={{ position: "absolute" }} />
            <SView col={"xs-12"} row style={{ justifyContent: 'flex-end', }} border={"transparent"} >
              <SText fontSize={32} color={STheme.color.text} font={"Roboto"}>{new SDate(DATA.fecha).toString("dd")}</SText>
              <SText fontSize={15} color={STheme.color.text} font={"Roboto"}>{new SDate(DATA.fecha).toString("MONTH")}</SText>
            </SView>
          </SView> */}
                <PFecha
                    dia={new SDate(this.state.data?.fecha_evento).toString('dd')}
                    mes={new SDate(this.state.data?.fecha_evento).toString('MONTH')}
                    backgroundColor={STheme.color.secondary}
                    position='center'
                    spacing={10}
                    style={{

                        zIndex: 999
                    }}
                />
            </>
        );
    }


    render() {
        // if(this.state.data){
        //     this.getActividades(this.state.data?.key_evento)
        // }
        if (!this.state.actividad) return;
        console.log("actividades", this.state.actividad)
        let arr = new SOrdenador([{ key: "index", order: "asc", peso: 1 }]).ordenarArray(this.state.actividad);
        let currentActivity = arr[0] ?? {}
        if (!this.state.foto_id) {
            this.state.foto_id = Object.values(this.state.actividad)[0]?.key;
            this.state.foto_id = currentActivity?.key;
        } else {
            currentActivity = arr.find(a => a.key == this.state.foto_id)
        }
        return <>
            <SPage center disableScroll>
                <Container loading={!this.state.data}  >
                    {/* <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'} > */}

                    <SView col={'xs-12'} center row card >
                        {this.getFecha()}
                        <SHr height={30} />
                        <SView col={'xs-11 sm-10 md-10 lg-10 xl-9'} center style={{
                            // borderRadius: 4,
                            overflow: "hidden",
                            borderBottomWidth: 3,
                            borderColor: STheme.color.primary,
                            padding: 5,
                            backgroundColor: STheme.color.secondary,
                        }} row>
                            <SHr height={10} />
                            <SIcon name={"fiesta2"} fill={STheme.color.primary} width={20} height={20} />
                            <SView width={5} />
                            <SText fontSize={22} bold center>
                                ENTRADA GRATIS
                            </SText>
                            <SView width={5} />
                            <SIcon name={"fiesta"} fill={STheme.color.primary} width={20} height={20} />
                            <SHr height={10} />

                        </SView>
                        <SHr height={20} />
                        <SView width={200} height={200} style={{
                            position: "relative",
                            // top: 0,
                            borderRadius: 100,
                            overflow: "hidden",
                            borderWidth: 4,
                            borderColor: STheme.color.primary,
                        }}>
                            {currentActivity?.tipo == "video" ?
                                <SVideo src={
                                    SSocket.api.repo +
                                    'actividad/' +
                                    this.state.foto_id
                                } height={200} />
                                : <ImageBlur
                                    src={
                                        SSocket.api.repo +
                                        'actividad/' +
                                        this.state.foto_id
                                    } height={200} />
                            }
                        </SView>
                        <SHr height={10} />
                        <SView col={'xs-11'} center>
                            <SText fontSize={24} bold center>
                                {this.state.data?.evento}
                            </SText>
                            <SHr height={10} />
                            <SView col={"xs-12"} style={{
                                borderBottomColor: STheme.color.card,
                                // borderBottomColor: "#B07E49",
                                borderStyle: 'dashed',
                                borderBottomWidth: 3
                                // width: 10

                            }} />
                            <SHr height={10} />
                            <SText fontSize={14} center>
                                Has recibido una entrada para asistir a un evento. Por favor, canjea tu entrada para asegurar tu lugar.
                            </SText>
                            <SHr height={15} />
                            <SView col={'xs-4'} height={45} border={'transparent'} center card>
                                <SText fontSize={18} center> Sector: {this.state.data?.tipo_entrada} </SText>
                            </SView>
                            {/* <ItemEntrega data={this.state.data} /> */}
                            <SHr />

                            {/* <SText color={STheme.color.link} onPress={this.handleCobrar.bind(this)}>{"Cobra tu manilla"}</SText>
                            <SHr height={20} /> */}

                        </SView>
                        {/* <SHr height={40} /> */}

                        <SHr height={20} />
                    </SView>
                    {/* </SView> */}
                    <SHr height={20} />
                    <SView col={"xs-10"} center style={{ borderRadius: 4, overflow: "hidden" }}>
                        <PButtomFooter
                            primary
                            fontSize={24}
                            onPress={this.handleCobrar.bind(this)}
                        // style={{ position: "absolute", bottom: 0, width: "100%" }}
                        >
                            CANJEAR ENTRADA
                        </PButtomFooter>
                    </SView>
                </Container>


            </SPage>
        </>
        // <SPage title={"Invitación"}>
        //     <Container loading={!this.state.data}>
        //         <SView col={"xs-12"} center>
        //             <ItemEntrega data={this.state.data} />
        //             <SHr />
        //             <SText color={STheme.color.link} onPress={this.handleCobrar.bind(this)}>{"Cobra tu manilla"}</SText>
        //         </SView>

        //     </Container>
        // </SPage>
    }
}
