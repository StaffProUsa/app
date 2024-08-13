import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SHr, SIcon, SImage, SLoad, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../../Components';
import EntradaItem from './Components/EntradaItem';
import EntradaQR from './Components/EntradaQR';
import Model from '../../Model';
import PFecha from '../../Components/PFecha';
import UsuarioItem from './Components/UsuarioItem';
import BannerEntrada from './Components/BannerEntrada';

export default class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key_entrada = SNavigation.getParam("key_entrada", "")
    }
    componentDidMount() {
        if (!this.key_entrada) {
            SPopup.alert("Entrada no encontrada, verifique el codigo.")
            SNavigation.goBack()
            return
        }
        SSocket.sendPromise({
            component: "entrada",
            type: "getByKey",
            key: this.key_entrada,
        }).then(e => {
            if (!e?.data?.key) {
                SPopup.confirm({
                    // icon:<SView width={50} height={50}><SIcon name='Alert'/></SView>,
                    title: <SText width={240} center color={STheme.color.danger}>{"Hay problemas con la entrada, intentar de nuevo?"}</SText>,
                    message: "Verifique que el link o el QR sean validos.",
                    onClose: () => {
                        if (this.close) return;
                        this.close = true;
                        SNavigation.goBack()
                    },
                    onPress: () => {
                        this.componentDidMount()
                    }
                })
                return;
            }
            this.setState({ data: e.data })
        }).catch(e => {
            SPopup.confirm({
                title: "Volver a intentar?",
                message: "No pudimos cargar la entrada",
                onPress: () => {
                    this.componentDidMount()
                },
                onClose: () => {
                    if (this.close) return;
                    this.close = true;
                    SNavigation.goBack()
                }
            })
            console.error(e);
        })
    }

    handleEntregar() {
        SPopup.confirm({
            title: "¿Está seguro que quiere entregar la manilla?",
            message: "bla bla bla",
            onPress: () => {
                this.setState({ loading: true })
                SSocket.sendPromise({
                    component: "entrada",
                    type: "entregar",
                    key_entrada: this.key_entrada,
                    key_usuario: Model.usuario.Action.getKey()
                }).then(e => {
                    this.setState({ loading: false })
                    this.componentDidMount();
                    if (this.props.onChange) {
                        this.props.onChange({
                            ...this.props.data,
                            ...e.data
                        })
                    }
                    console.log("Entregado con exito");
                }).catch(e => {
                    this.setState({ loading: false })
                    SNotification.send({
                        title: "Error",
                        body: e?.error,
                        color: STheme.color.danger,
                        time: 5000,
                    })
                })
            }
        })
    }

    botonStyle() {
        return <SView width={220} height={40} row style={{
            backgroundColor: STheme.color.secondary,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: STheme.color.primary
        }} onPress={() => {

        }} >
            <SView width={50} height backgroundColor={STheme.color.primary} center>
                <SIcon name={'shareIcon'} fill={STheme.color.secondary} height={20} width={20} />
            </SView>
            <SView flex height center>
                <SText center bold fontSize={16}>COMPARTIR</SText>
            </SView>
        </SView>
    }
    renderEntregar() {
        let permiso = Model.usuarioPage.Action.getPermiso({ url: "/entrega", permiso: "entregar", loading: "" });
        if (!this.state.data) return;
        if (!permiso) return null;
        const { fecha_entrega, key_usuario_entrega } = this.state.data;

        // console.log("data_usuario_entrega", data_usuario_entrega)
        if (this.state.loading) return <SLoad />
        if (fecha_entrega) return null;
        return <SView col={"xs-12"} center row padding={5}>
            <SView width={187} height={40} row style={{
                backgroundColor: STheme.color.secondary,
                borderRadius: 8,
                borderWidth: 1,
                overflow: "hidden",
                borderColor: STheme.color.primary
            }} onPress={this.handleEntregar.bind(this)} >
                <SView width={50} height backgroundColor={STheme.color.primary} center style={{ overflow: "hidden" }}>
                    <SIcon name={'entregar'} fill={STheme.color.secondary} height={25} width={25} />
                </SView>
                <SView flex height center>
                    <SText center bold fontSize={16}>ENTREGAR</SText>
                </SView>
            </SView>
        </SView>

        // let data_usuario_entrega = Model.usuario.Action.getByKey(key_usuario_entrega);
        // if (!data_usuario_entrega) return <SLoad />;

        // return <>
        //     <SView col={"xs-12"} row card padding={10} height>
        //         <SText fontSize={16}>Manilla entregada</SText>
        //         <SHr height={3} />
        //         <SView row col={'xs-12'} center
        //             style={{
        //                 borderBottomWidth: 1,
        //                 borderBottomColor: STheme.color.card,
        //             }} />
        //         <SHr />
        //         <SText fontSize={10} color={STheme.color.gray}>Entregado por el usuario:</SText>
        //         <SHr />
        //         <SView col={"xs-12"} row >
        //             <SView width={24} height={24} style={{ borderRadius: 100, overflow: "hidden" }} card>
        //                 <SImage src={SSocket.api.root + "usuario/" + key_usuario_entrega} enablePreview />
        //             </SView>
        //             <SView col={"xs-12"} flex >
        //                 <SText fontSize={10} paddingStart={5}>{data_usuario_entrega.Nombres} {data_usuario_entrega.Apellidos}</SText>
        //                 <SText fontSize={10} paddingStart={5}>{data_usuario_entrega.Correo}</SText>
        //             </SView>
        //         </SView>
        //         <SHr height={3} />
        //         <SView col={"xs-12"} style={{ alignItems: "flex-end" }}  >
        //             <SHr height={3} />
        //             <SText fontSize={10} color={STheme.color.gray}>Fecha entregada</SText>
        //             <SHr height={3} />
        //             <SText fontSize={12}> {new SDate(fecha_entrega, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}</SText>
        //         </SView>
        //     </SView>
        // </>
    }
    handleParticiparInvitar() {
        const { key } = this.state.data;
        SNavigation.navigate("/entradas/invite", { key_entrada: key })
    }
    renderParticipante() {
        if (!this.state.data) return;
        const { key_participante, numero, key_usuario_invito } = this.state.data;
        // if (!key_participante) return <SView height={24} />;
        if (key_participante) return;
        return <SView col={"xs-12"} row padding={5} center>
            <SView width={187} height={40} row style={{
                backgroundColor: STheme.color.secondary,
                borderRadius: 8,
                borderWidth: 1,
                overflow: "hidden",
                borderColor: STheme.color.primary
            }} onPress={this.handleParticiparInvitar.bind(this)} >
                <SView width={50} height backgroundColor={STheme.color.primary} center style={{ overflow: "hidden" }}>
                    <SIcon name={'invitar'} fill={STheme.color.secondary} height={25} width={25} />
                </SView>
                <SView flex height center>
                    <SText center bold fontSize={13}>REGALAR ENTRADA</SText>
                </SView>
            </SView>
        </SView>
        let data_participante = Model.usuario.Action.getByKey(key_participante);
        let data_invitado = Model.usuario.Action.getByKey(key_usuario_invito);
        if (!data_invitado) return <SLoad />

        return <>
            <SView col={"xs-12"} row card padding={10} height>
                <SText fontSize={16}>Participante</SText>
                <SHr height={3} />
                <SView row col={'xs-12'} center
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: STheme.color.card,
                    }} />
                <SHr />
                <SView width={24} height={24} style={{ borderRadius: 100, overflow: "hidden" }} card>
                    <SImage src={SSocket.api.root + "usuario/" + key_participante} enablePreview />
                </SView>
                <SView flex style={{
                    justifyContent: "center",
                    paddingStart: 4
                }}>
                    <SText color={STheme.color.text} fontSize={10}>{data_participante?.Nombres} {data_participante?.Apellidos}</SText>
                    <SText color={STheme.color.text} fontSize={10}>{data_participante?.Correo}</SText>
                </SView>
                <SHr height={3} />
            </SView>
            <SView col={"xs-12"} height={16} />
            <SView col={"xs-12"} row card padding={10} height>
                <SText fontSize={16}>Creador del link de invitación</SText>
                <SHr height={3} />
                <SView row col={'xs-12'} center
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: STheme.color.card,
                    }} />
                <SHr />
                <SView width={24} height={24} style={{ borderRadius: 100, overflow: "hidden" }} card>
                    <SImage src={SSocket.api.root + "usuario/" + key_usuario_invito} enablePreview />
                </SView>
                <SView flex style={{
                    justifyContent: "center",
                    paddingStart: 4
                }}>
                    <SText color={STheme.color.text} fontSize={10}>{data_invitado?.Nombres} {data_invitado?.Apellidos}</SText>
                    <SText color={STheme.color.text} fontSize={10}>{data_invitado?.Correo}</SText>
                </SView>
                <SHr height={3} />
            </SView>
        </>
    }

    renderUsuarioComprador() {
        if (!this.state.data) return;
        let data_usuario_comprador = Model.usuario.Action.getByKey(this.state.data.key_usuario);
        return <SView col={"xs-12"} row card padding={10} height>
            <SView col={"xs-6"} style={{
                borderRightWidth: 1,
                borderRightColor: STheme.color.card,
            }} center>
                <SText fontSize={16}>Usuario comprador:</SText>
            </SView>
            <SView col={"xs-6"} row padding={5}>
                <SView width={24} height={24} style={{ borderRadius: 100, overflow: "hidden" }} card>
                    <SImage src={SSocket.api.root + "usuario/" + this.state.data.key_usuario} enablePreview />
                </SView>
                <SView flex style={{
                    justifyContent: "center",
                    paddingStart: 4
                }}>
                    <SText color={STheme.color.text} fontSize={10}>{data_usuario_comprador?.Nombres} {data_usuario_comprador?.Apellidos}</SText>
                    <SText color={STheme.color.text} fontSize={10}>{data_usuario_comprador?.Correo}</SText>
                </SView>
            </SView>
        </SView>
    }

    getFecha() {
        return (
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
        );
    }


    renderUsuario = ({ label, key_usuario }) => {
        if (!key_usuario) return null;
        const usuario = {}
        return <SView col={"xs-12"} row card height={40} >
            <SView col={"xs-4"} style={{
                borderRightWidth: 1,
                borderRightColor: STheme.color.card,
            }} center height>
                <SText fontSize={16}>{label}</SText>
            </SView>
            <SView col={"xs-8"} row height center>
                <SView width={24} height={24} style={{ borderRadius: 100, overflow: "hidden" }} card>
                    <SImage src={SSocket.api.root + "usuario/" + key_usuario} enablePreview />
                </SView>
                <SView flex >
                    <SText color={STheme.color.text} fontSize={10}>{usuario?.Nombres} {usuario?.Apellidos}</SText>
                    <SText color={STheme.color.text} fontSize={10}>{usuario?.Correo}</SText>
                </SView>
            </SView>
        </SView>
    }
    render() {

        if(!this.state?.data) return <SLoad />
        
        
        return <SPage onRefresh={(e) => {
            Model.usuarioPage.Action.CLEAR()
            this.setState({ data: null })
            this.componentDidMount();
            if (e) e()
        }} >
            <BannerEntrada key_evento={this.state?.data?.key_evento} key_entrada={this.key_entrada} key_usuario={this.state?.data?.key_participante ?? this.state?.data?.key_usuario} />
            <SHr h={100}/>
            <Container loading={!this.state.data}>
                <SHr />
                <EntradaItem data={this.state.data} />
                <SHr h={16} />
                <UsuarioItem key_usuario={this.state?.data?.key_usuario} label={"Comprador"} fecha={new SDate(this.state?.data?.fecha_on, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} />
                <SHr />
                <UsuarioItem key_usuario={this.state?.data?.key_participante} label={"Invitado"} />
                {this.renderParticipante()}
                {/* <SHr /> */}
                {/* {this.renderUsuario({ label: "Remitente", key_usuario: this.state?.data?.key_usuario_invito })} */}
                <SHr />
                <UsuarioItem key_usuario={this.state?.data?.key_usuario_entrega} label={"Entregado por"} fecha={new SDate(this.state?.data?.fecha_entrega, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} />
                <SHr />
                {this.renderEntregar()}

                <SHr />

                {/* <SText onPress={() => {
                    SNavigation.navigate("/entradas/banner", { key_entrada: this.key_entrada })
                }}>Ver banner</SText> */}
                {/* <SHr h={16} />
                <SView col={"xs-12"} row center >
                    {this.renderUsuarioComprador()}
                </SView>
                <SHr h={16} />
                <SView col={"xs-12 sm-5.8 md-5.8 lg-5.8 xl-5.8 xxl-5.8"} row center>
                    {this.renderEntregar()}
                </SView>
                <SView col={"xs-12 sm-0.3"} row height={16} />
                <SView col={"xs-12 sm-5.8 md-5.8 lg-5.8 xl-5.8 xxl-5.8"} row  >
                    {this.renderParticipante()}
                </SView> */}
                {/* <SHr h={16} /> */}
                {/* <SView col={"xs-12"} card center padding={8} >
                    <SHr height={15} />
                    <EntradaQR key_entrada={this.key_entrada} />
                    <SHr height={8} />
                    <SText fontSize={12} color={STheme.color.lightGray}>No compartas este QR.</SText>
                </SView> */}

            </Container>
        </SPage>
    }
}
