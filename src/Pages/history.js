import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { SImage, SList2, SPage, SText, STheme, SView, SLanguage, SHr, SIcon, SDate, SNavigation, SLoad, SUtil } from 'servisofts-component';
import { Container } from '../Components';
import Degradado from '../Components/Degradado';
import PBarraFooter from '../Components/PBarraFooter';
import Card from 'servisofts-component/img/Card';

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

        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getMisTrabajos",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            Object.values(e.data).map((obj) => {
                const f = new SDate(obj.evento.fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd")
                const hi = new SDate(obj.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
                const hf = new SDate(obj.staff.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
                obj._fecha_inicio = f + "T" + hi
                if(obj.staff.fecha_fin){
                    obj._fecha_fin = f + "T" + hf
                }

            })
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })

        // SSocket.sendPromise({
        //     component: "staff_usuario",
        //     type: "getTrabajosProximos",
        //     key_usuario: Model.usuario.Action.getKey()
        // }).then(e => {
        //     this.setState({ data: e.data })
        // }).catch(e => {
        //     console.error(e);
        // })

        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getHistorico",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            this.setState({ dataResumen: e.data })
        }).catch(e => {
            console.error(e);
        })
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
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
        return <SList2 data={this.state.data} order={[{ key: "_fecha_inicio", order: "desc" }]} render={(obj) => {
            let isInvitation = (obj?.staff_usuario?.estado == 2)
            let userCoordinador = Model.usuario.Action.getByKey(obj?.staff_usuario?.key_usuario_atiende)
            console.log("obj", obj)
            console.log("userCoordinador", userCoordinador)

            return <SView col={"xs-12"} row padding={15} style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: STheme.color.lightGray,
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
                <SView col={"xs-10"} >
                    <SText fontSize={14}>{obj?.cliente?.descripcion}</SText>
                    <SText fontSize={12} color={STheme.color.gray}>{obj?.staff_tipo?.descripcion}</SText>
                    <SText fontSize={10} color={STheme.color.gray}>{SUtil.limitString(obj?.staff?.descripcion, 120)}</SText>
                </SView>
                <SHr height={10} />
                <SHr height={1} color={STheme.color.lightGray} />
                <SHr height={10} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"dating"} fill={STheme.color.gray} width={12} />
                </SView>
                <SView col={"xs-10"} row >
                    <SText col={"xs-4"} fontSize={12}>{new SDate(obj?.staff?.fecha_inicio).toString("yyyy MONTH dd")}</SText>
                    <SText col={"xs-4"} fontSize={12}>{new SDate(obj?.evento?.fecha).toString("yyyy MONTH dd")}</SText>
                </SView>
                <SHr />
                <SView>
                    <SText fontSize={10}>Clock In : {!obj.fecha_ingreso ? "No" : new SDate(obj.fecha_ingreso, "yyyy-MM-ddThh:mm:ss").toString("yyyy MONTH dd, HH")}</SText>
                    <SText fontSize={10}>Clock Out: {!obj.fecha_salida ? "No" : new SDate(obj.fecha_salida, "yyyy-MM-ddThh:mm:ss").toString("yyyy MONTH dd, HH")}</SText>
                </SView>
            </SView>
        }} />
    }
    CardResumen({ title, value, color, icon }) {
        return <SView col={"xs-6"} row style={{ paddingRight: 5, paddingBottom: 5 }}>
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
                <this.CardResumen title={SLanguage.select({ es: "Total eventos", en: "Total events" })} value={eventos} color={"#C09C0C"} icon={"hisEvent"} />
                <this.CardResumen title={SLanguage.select({ es: "Eventos completados", en: "Completed events" })} value={eventos_completados} color={"#33BE5B"} icon={"hisCompleted"} />
                <this.CardResumen title={SLanguage.select({ es: "Eventos asistidos", en: "Events attended" })} value={eventos_asistidos} color={"#511B8D"} icon={"asistido"} />
                <this.CardResumen title={SLanguage.select({ es: "Eventos no asistidos", en: "Unattended events" })} value={eventos_no_asistidos} color={"#566471"} icon={"noAsistido"} />
            </SView>
        </>
    }


    render() {
        return <SPage titleLanguage={{ es: "Mi historial", en: "My history" }} footer={<PBarraFooter url={'/trabajos'} />}>
            <Container>
                {this.getPerfil()}
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
