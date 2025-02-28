import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SNavigation, SText, STheme, SUtil, SView, SLanguage, SDate } from 'servisofts-component';
import SSocket from 'servisofts-socket';


export default class EstadoEvento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        if (!this.props.key_cliente) return;
        SSocket.sendPromise({
            component: "evento",
            type: "getEstadoEventos",
            key_cliente: this.props.key_cliente
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.log(e)
        })
    }


    render() {
        const arr = Object.values(this.state.data) ?? [];
        let pasado = false;
        let hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Ignorar la hora, comparar solo la fecha
        let cont = 0;
        const eventosFuturos = Object.entries(arr) // Convertir objeto en array de pares clave-valor
            .filter(([key, evento]) => {
                let fechaEvento = new Date(evento.fecha);
                fechaEvento.setHours(0, 0, 0, 0); // Asegurar que la comparación sea solo por fecha
                return fechaEvento >= hoy; // Solo los eventos futuros o actuales
            })
            .map(([key, evento]) => ({ key, ...evento })); // Restaurar formato con key incluida

        if (eventosFuturos.length == 0) {
            pasado = true;
        }
        return <>
            {(!pasado) ? <SView center style={{
                backgroundColor: STheme.color.warning,
                borderRadius: 25,
                width: 17,
                height: 17,
                position: "absolute",
                right: 42,
                top: 0,
                zIndex: 999,
            }}><SText color={STheme.color.white} bold fontSize={9}>{eventosFuturos.length}</SText>
            </SView> : null}

            <SView width={30} height={30} center style={{
                borderRadius: 7,
                backgroundColor: pasado ? STheme.color.lightGray : STheme.color.success,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <SIcon name='eventIcon2' width={22} height={22} fill={pasado ? STheme.color.white : STheme.color.white} />
                {/* <SText>{eventosFuturos.length}</SText> */}
            </SView>
        </>
    }
}
