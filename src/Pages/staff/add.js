import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SHr, SInput, SNavigation, SPage, SText, SView } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import list from "./list"
import event from '../company/event';
const formatTime = (time: any) => {
    // Eliminar caracteres no numéricos y no ':'
    let filtered = time.replace(/[^0-9:]/g, '');

    // Separar en partes
    const parts = filtered.split(':');
    let hh = parts[0] || '';
    let mm = parts[1] || '';

    // Agregar ceros a la izquierda si es necesario
    hh = hh.padStart(2, '0');
    mm = mm.padStart(2, '0');

    // Limitar los valores de las horas y minutos
    if (parseInt(hh, 10) > 23) hh = '23';
    if (parseInt(mm, 10) > 59) mm = '59';

    // Unir de nuevo si no tiene minutos
    if (filtered.includes(':')) {
        return `${hh}:${mm}`;
    }
    return `${hh}:00`; // Si no incluye ':', asumir minutos '00'
}
const timeToMinutes = (time: any) => {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 60 + mm;
};
export default class add extends Component {

    filterHorario(e: string) {
        // Permitir solo números y el carácter ':'
        let filtered = e.replace(/[^0-9:]/g, '');

        // Formatear a HH:MM
        const parts = filtered.split(':');
        if (parts.length > 2) return ''; // No más de un ':'

        let hh = parts[0] || '';
        let mm = parts[1] || '';

        // Limitar los valores de las horas y minutos
        if (hh.length > 2) {
            mm = hh.slice(2, 4);
            hh = hh.slice(0, 2);

            console.log("hay mm ", hh, ":", mm)

        }
        if (mm.length > 2) mm = mm.slice(0, 2);

        // Asegurarse de que horas y minutos sean válidos
        if (hh.length === 2 && parseInt(hh, 10) > 23) hh = '23';
        if (mm.length === 2 && parseInt(mm, 10) > 59) mm = '59';

        // Unir de nuevo si hay minutos
        if (hh.length === 2 && filtered.includes(':')) {
            filtered = `${hh}:${mm}`;
        } else {
            let adyen = ""
            console.log(e);
            if (filtered.includes(":")) {
                console.log(e);
                adyen = ":"
            }
            filtered = `${hh}${mm ? ':' + mm : adyen}`;
        }

        return filtered;
    }
    constructor(props) {
        super(props);
        this.state = {
            key_evento: SNavigation.getParam("key_evento"),
            fecha: SNavigation.getParam("fecha"),
        };
    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "evento",
            type: "getByKey",
            key: this.state.key_evento,
        }).then(e => {
            this.setState({ data: e.data })
            console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }
    handlePress() {
        const val = {}
        let valid = true;
        Object.keys(this._ref).map((k) => {
            const input: SInput = this._ref[k];
            if (!input.verify()) {
                valid = false;
            } else {
                val[k] = input.getValue()
            }
        })
        const dataTipo = this._ref["tipo"].getData();

        if (!valid) {
            return;
        }
        SSocket.sendPromise({
            component: "staff",
            type: "registro",
            data: {
                "descripcion": val.descripcion,
                "observacion": val.observacion,
                "key_evento": this.state.key_evento,
                "key_staff_tipo": dataTipo.key,
                "fecha_inicio": val.fecha_inicio + " " + formatTime(val.hora_inicio ?? ""),
                "fecha_fin": val.fecha_fin + " " + formatTime(val.hora_fin ?? ""),
                cantidad: val.cantidad
            },
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            if (event.INSTANCE) event.INSTANCE.componentDidMount();
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);
        })

    }
    _ref = {}
    render() {
        return <SPage titleLanguage={{ en: "Staff", es: "Staff" }}>
            <Container>
                <SView row col={"xs-12"} style={{
                    justifyContent: "space-between"
                }}>
                    <SInput
                        ref={r => this._ref["tipo"] = r}
                        label={"Tipo de staff"}
                        col={"xs-7"}
                        editable={false}
                        placeholder={"Seleccione su tipo de staff"}
                        required
                        onPress={() => {
                            if (!this.state?.data?.key_company) return;
                            SNavigation.navigate("/staff_tipo", {
                                key_company: this.state?.data?.key_company, onSelect: (e) => {
                                    const input: SInput = this._ref["tipo"];
                                    input.setValue(e.descripcion)
                                    input.setData(e);

                                }
                            })
                        }} />
                    <SInput ref={r => this._ref["descripcion"] = r} label={"Descripcion"} required placeholder={"Descripcion del staff"} type='textArea' />
                    <SInput ref={r => this._ref["cantidad"] = r} defaultValue={1} col={"xs-7"} label={"Cantidad"} required placeholder={"0"} />
                    <SInput ref={r => this._ref["fecha_inicio"] = r} defaultValue={this.state.fecha} col={"xs-5.5"} type='date' label={"Fecha Inicio"} required placeholder={"yyyy-MM-dd"} />
                    <SInput ref={r => this._ref["hora_inicio"] = r} col={"xs-5.5"} defaultValue={"00:01"} label={" "} placeholder={"hh:mm"} required onChangeText={(e => {
                        const resp = this.filterHorario(e);
                        if (resp != e) {

                            this._ref["hora_inicio"].setValue(resp);
                        }
                        // return this.filterHorario(e);
                    })} />
                    <SInput ref={r => this._ref["fecha_fin"] = r} defaultValue={this.state.fecha} col={"xs-5.5"} type='date' label={"Fecha Fin"} required placeholder={"yyyy-MM-dd"} />
                    <SInput ref={r => this._ref["hora_fin"] = r} col={"xs-5.5"} label={" "} defaultValue={"23:59"} placeholder={"hh:mm"} required onChangeText={(e => {
                        const resp = this.filterHorario(e);
                        if (resp != e) {

                            this._ref["hora_fin"].setValue(resp);
                        }
                        // return this.filterHorario(e);
                    })} />
                </SView>
                <SHr h={16} />
                <SButtom onPress={this.handlePress.bind(this)} type='danger'>{"GUARDAR"}</SButtom>

            </Container>

        </SPage>
    }
}
