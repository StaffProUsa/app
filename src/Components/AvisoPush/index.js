import React, { Component } from 'react';
import { Platform } from 'react-native';
import { SHr, SIcon, SText, STheme, SView } from 'servisofts-component';
import Firebase from '../../Firebase';
import { estadoPush, PASOS_IOS, TEXTO_BLOQUEADO } from './estado';

// Aviso del inicio para activar las notificaciones push web.
// - Permiso sin pedir: botón ACTIVAR (el navegador exige que el permiso se pida tras un toque).
// - Permiso bloqueado: cómo desbloquearlo.
// - iPhone en Safari sin instalar: cómo agregar la web a la pantalla de inicio (única forma de recibir push en iOS).
// - Ya activas o navegador sin soporte: no se muestra.
// "Ahora no" lo oculta unos días en este navegador; siempre se pueden activar desde Perfil → Opciones (FilaPush).
const KEY_OCULTO = "staffpro_aviso_push_hasta";
const DIAS_OCULTO = 3;

export default class AvisoPush extends Component {
    constructor(props) {
        super(props);
        this.state = { estado: this.calcularEstado(), cargando: false, verPasos: false };
        this.onCambio = () => this.setState({ estado: this.calcularEstado() });
    }

    componentDidMount() {
        if (Platform.OS == "web") Firebase.addListener(this.onCambio);
    }
    componentWillUnmount() {
        if (Platform.OS == "web") Firebase.removeListener(this.onCambio);
    }

    calcularEstado() {
        if (this.ocultoHasta() > Date.now()) return "oculto";
        const estado = estadoPush();
        return ["ios", "activar", "bloqueado"].includes(estado) ? estado : "oculto";
    }

    ocultoHasta() {
        try {
            return parseInt(localStorage.getItem(KEY_OCULTO) || "0");
        } catch (e) {
            return 0;
        }
    }

    ahoraNo() {
        try {
            localStorage.setItem(KEY_OCULTO, String(Date.now() + DIAS_OCULTO * 24 * 60 * 60 * 1000));
        } catch (e) { }
        this.setState({ estado: "oculto" });
    }

    async activar() {
        if (this.state.cargando) return;
        this.setState({ cargando: true });
        await Firebase.activar();
        this.setState({ cargando: false, estado: this.calcularEstado() });
    }

    renderBoton(texto, onPress) {
        return <SView col={"xs-3"} row center>
            <SView col={"xs-12"} row center padding={10} backgroundColor={"#585858"}
                style={{ borderRadius: 6 }} onPress={onPress}>
                <SText color={STheme.color.white} center language={texto} />
            </SView>
        </SView>
    }

    renderPasosIOS() {
        return <SView col={"xs-12"} style={{ paddingLeft: 15, paddingRight: 15, paddingBottom: 12 }}>
            {PASOS_IOS.map((p, i) => <SText key={i} color={"#585858"} language={p} />)}
        </SView>
    }

    render() {
        const { estado, cargando, verPasos } = this.state;
        if (estado == "oculto") return null;

        let titulo, texto, boton = null;
        if (estado == "activar") {
            titulo = { es: "ACTIVA LAS NOTIFICACIONES", en: "TURN ON NOTIFICATIONS" };
            texto = { es: "Entérate al instante de nuevas invitaciones y recordatorios de turno.", en: "Get new job invitations and shift reminders instantly." };
            boton = this.renderBoton(cargando ? { es: "...", en: "..." } : { es: "ACTIVAR", en: "TURN ON" }, () => this.activar());
        } else if (estado == "bloqueado") {
            titulo = { es: "NOTIFICACIONES BLOQUEADAS", en: "NOTIFICATIONS BLOCKED" };
            texto = TEXTO_BLOQUEADO;
        } else {
            titulo = { es: "RECIBE AVISOS EN TU IPHONE", en: "GET ALERTS ON YOUR IPHONE" };
            texto = { es: "Agrega Staff Pro USA a tu pantalla de inicio para recibir notificaciones.", en: "Add Staff Pro USA to your Home Screen to receive notifications." };
            boton = this.renderBoton(verPasos ? { es: "OCULTAR", en: "HIDE" } : { es: "VER CÓMO", en: "SHOW ME" }, () => this.setState({ verPasos: !verPasos }));
        }

        return <>
            <SHr h={10} />
            <SView col={"xs-12"}
                style={{
                    backgroundColor: "#E3ECF7",
                    borderRadius: 14,
                    borderLeftWidth: 4,
                    borderLeftColor: "#3B6FB6",
                }}>
                <SView col={"xs-12"} row padding={15}>
                    <SView col={"xs-2"} row center padding={5}>
                        <SIcon name={"Notificacion"} fill={"#3B6FB6"} width={30} height={30} />
                    </SView>
                    <SView col={boton ? "xs-7" : "xs-10"}>
                        <SText fontSize={16} bold color={"#585858"} language={titulo} />
                        <SText color={"#585858"} language={texto} />
                        <SHr h={6} />
                        <SView onPress={() => this.ahoraNo()}>
                            <SText fontSize={12} color={"#3B6FB6"} language={{ es: "Ahora no", en: "Not now" }} />
                        </SView>
                        <SText fontSize={11} color={"#8B8B8B"} language={{
                            es: "Puedes activarlas después en Perfil → Opciones.",
                            en: "You can turn them on later in Profile → Options."
                        }} />
                    </SView>
                    {boton}
                </SView>
                {estado == "ios" && verPasos ? this.renderPasosIOS() : null}
            </SView>
            <SHr h={10} />
        </>
    }
}
