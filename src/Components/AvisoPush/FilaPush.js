import React, { Component } from 'react';
import { Platform } from 'react-native';
import { SHr, SIcon, SText, STheme, SView } from 'servisofts-component';
import Firebase from '../../Firebase';
import { estadoPush, PASOS_IOS, TEXTO_BLOQUEADO } from './estado';

// Fila "Avisos push" de Perfil → Opciones con un interruptor, igual que "Modo claro / oscuro".
// Encendido = este navegador recibe push. Apagarlo da de baja la suscripción (la web no puede quitar el
// permiso del navegador). Si están bloqueadas o es un iPhone sin instalar, el interruptor queda
// deshabilitado y "ver cómo" explica qué hacer.
const TEXTO_ESTADO = {
    activo: { es: "Activadas", en: "On" },
    activar: { es: "Desactivadas", en: "Off" },
    apagado: { es: "Desactivadas", en: "Off" },
    bloqueado: { es: "Bloqueadas en este navegador · ver cómo", en: "Blocked in this browser · see how" },
    ios: { es: "Agrega la app a tu pantalla de inicio · ver cómo", en: "Add the app to your Home Screen · see how" },
    sin_soporte: { es: "No disponibles en este navegador", en: "Not available in this browser" },
};

export default class FilaPush extends Component {
    constructor(props) {
        super(props);
        this.state = { estado: estadoPush(), cargando: false, verDetalle: false };
        this.onCambio = () => this.setState({ estado: estadoPush() });
    }

    componentDidMount() {
        if (Platform.OS == "web") Firebase.addListener(this.onCambio);
    }
    componentWillUnmount() {
        if (Platform.OS == "web") Firebase.removeListener(this.onCambio);
    }

    async alternar() {
        const { estado, cargando } = this.state;
        if (cargando) return;
        if (estado != "activo" && estado != "activar" && estado != "apagado") return;
        this.setState({ cargando: true });
        if (estado == "activo") await Firebase.desactivar();
        else await Firebase.activar();
        this.setState({ cargando: false, estado: estadoPush() });
    }

    renderSwitch() {
        const { estado, cargando } = this.state;
        const encendido = estado == "activo";
        const habilitado = estado == "activo" || estado == "activar" || estado == "apagado";
        // Mismo aspecto que SwitchTheme (Modo claro / oscuro)
        return <SView
            nativeID={"switch-push"}
            style={{
                width: 35,
                height: 20,
                borderRadius: 18,
                justifyContent: 'center',
                backgroundColor: encendido ? '#2FC25F' : '#B7B7B7',
                opacity: habilitado && !cargando ? 1 : 0.4,
            }}
            onPress={() => this.alternar()}>
            <SView style={{
                width: 16,
                height: 16,
                borderRadius: 100,
                position: 'absolute',
                left: encendido ? 35 - 16 - 4 : 4,
            }} backgroundColor={'#fff'} />
        </SView>
    }

    renderDetalle() {
        const { estado, verDetalle } = this.state;
        if (!verDetalle) return null;
        const lineas = estado == "ios" ? PASOS_IOS : estado == "bloqueado" ? [TEXTO_BLOQUEADO] : [];
        return <SView col={"xs-12"} style={{ paddingTop: 8 }}>
            {lineas.map((l, i) => <SText key={i} fontSize={12} color={STheme.color.lightGray} language={l} />)}
        </SView>
    }

    render() {
        const { estado, verDetalle } = this.state;
        if (estado == "no_web") return null;
        const conDetalle = estado == "bloqueado" || estado == "ios";
        return <>
            <SView row col={'xs-11'}
                style={{ borderBottomWidth: 1, borderBottomColor: STheme.color.lightGray }}>
                <SView row col={'xs-1'}>
                    <SIcon name={'Notificacion'} width={20} height={20} fill={STheme.color.text} />
                </SView>
                <SView col={'xs-9'} onPress={conDetalle ? () => this.setState({ verDetalle: !verDetalle }) : undefined}>
                    <SText font={"Roboto"} color={STheme.color.text} language={{ es: "Avisos push", en: "Push alerts" }} />
                    <SText fontSize={11} color={conDetalle ? "#3B6FB6" : STheme.color.lightGray} language={TEXTO_ESTADO[estado]} />
                </SView>
                <SView flex col={'xs-2'} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    {this.renderSwitch()}
                </SView>
                {this.renderDetalle()}
                <SHr height={20} />
            </SView>
            <SHr height={20} />
        </>
    }
}
