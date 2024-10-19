import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SInput, SNavigation, SPage, SPopup, SText, SView, SLanguage, STheme } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import list from "./list"
import event from '../company/event';
import Input from '../../Components/Input';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
import InputHora from '../../Components/NuevoInputs/InputHora';
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
            pk: SNavigation.getParam("pk"),
            key_evento: SNavigation.getParam("key_evento"),
            key_company: SNavigation.getParam("key_company"),
            fecha: SNavigation.getParam("fecha"),
        };
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))

        if (!this.state.pk) return;
        SSocket.sendPromise({
            component: "staff",
            type: "getByKey",
            key: this.state.pk,
        }).then(e => {
            // this.setState({ data: e.data })
            this.state.data = e.data;
            this._ref["descripcion"].setValue(e.data.descripcion)
            this._ref["cantidad"].setValue(e.data.cantidad)
            this._ref["fecha_inicio"].setValue(new SDate(e.data.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd"))
            this._ref["hora_inicio"].setValue(new SDate(e.data.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm"))
            // this._ref["fecha_fin"].setValue(new SDate(e.data.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd"))
            // this._ref["hora_fin"].setValue(new SDate(e.data.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm"))
            console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
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
        if (!valid) {
            return;
        }

        if (this.state.pk) {
            SSocket.sendPromise({
                component: "staff",
                type: "editar",
                data: {
                    ...this.state.data,
                    "descripcion": val.descripcion,
                    "observacion": val.observacion,
                    "fecha_inicio": val.fecha_inicio + " " + formatTime(val.hora_inicio ?? ""),
                    // "fecha_fin": val.fecha_fin + " " + formatTime(val.hora_fin ?? ""),
                    cantidad: val.cantidad
                },
                key_usuario: Model.usuario.Action.getKey(),
            }).then(e => {
                if (event.INSTANCE) event.INSTANCE.componentDidMount();
                SNavigation.goBack();
            }).catch(e => {
                console.error(e);
            })
        } else {
            const dataTipo = this._ref["tipo"].getData();
            SSocket.sendPromise({
                component: "staff",
                type: "registro",
                data: {
                    "descripcion": val.descripcion,
                    "observacion": val.observacion,
                    "key_evento": this.state.key_evento,
                    "key_staff_tipo": dataTipo.key,
                    "fecha_inicio": val.fecha_inicio + " " + formatTime(val.hora_inicio ?? ""),
                    // "fecha_fin": val.fecha_fin + " " + formatTime(val.hora_fin ?? ""),
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


    }
    handleEliminar() {
        let lenguaje = SLanguage.language;
        SPopup.confirm({
            title: (lenguaje == "es") ? "¿Seguro de eliminar?" : "Are you sure to delete?",
            onPress: () => {
                SSocket.sendPromise({
                    component: "staff",
                    type: "editar",
                    data: {
                        ...this.state.data,
                        estado: 0,
                    },
                    key_usuario: Model.usuario.Action.getKey(),
                }).then(e => {
                    if (event.INSTANCE) event.INSTANCE.componentDidMount();
                    SNavigation.goBack();
                }).catch(e => {
                    console.error(e);
                })
            }
        })

    }
    _ref = {}
    render() {
        let lenguaje = SLanguage.language;
        let tipo_staff = "Seleccione Tipo de staff";
        let descripcion = "Descripcion del staff";
        let cantidad = "Cantidad";
        let fecha_inicio = "Fecha de inicio";
        if (lenguaje == "en") {
            tipo_staff = "Select staff type";
            descripcion = "Staff description";
            cantidad = "Quantity";
            fecha_inicio = "Start date";
        }
        return <SPage titleLanguage={{ en: "Staff", es: "Staff" }
        } >
            <Container>
                <SView row col={"xs-12"} style={{
                    justifyContent: "space-between"
                }}>
                    {this.state.pk ? null : <SInput
                        ref={r => this._ref["tipo"] = r}
                        label={tipo_staff}
                        col={"xs-7"}
                        editable={false}
                        placeholder={tipo_staff}
                        required
                        onPress={() => {
                            if (!this.state?.key_company) return;
                            SNavigation.navigate("/staff_tipo", {
                                key_company: this.state.key_company, onSelect: (e) => {
                                    const input: SInput = this._ref["tipo"];
                                    input.setValue(e.descripcion)
                                    input.setData(e);

                                }
                            })
                        }} />
                    }
                    <SInput ref={r => this._ref["descripcion"] = r} label={descripcion} required placeholder={descripcion} type='textArea' />
                    <SInput ref={r => this._ref["cantidad"] = r} defaultValue={1} col={"xs-7"} label={cantidad} required placeholder={"0"} />
                    <SInput ref={r => this._ref["fecha_inicio"] = r} disabled defaultValue={this.state.fecha} col={"xs-5.5"} type='date' label={fecha_inicio} required placeholder={"yyyy-MM-dd"} />
                    {/* <SInput ref={r => this._ref["hora_inicio"] = r} type='hour' col={"xs-5.5"} defaultValue={"00:01"} label={" "} placeholder={"hh:mm"} required onChangeText={(e => { */}
                    {/* <SInput ref={r => this._ref["hora_inicio"] = r} type='hour' col={"xs-5.5"} label={" "} placeholder={"hh:mm"} required onChangeText={(e => {
                        const resp = this.filterHorario(e);
                        if (resp != e) {

                            this._ref["hora_inicio"].setValue(resp);
                        }
                    })} /> */}
                    <Input col={"xs-5.5"} inputStyle={{
                        height: 40,
                        borderRadius: 4,
                        backgroundColor: STheme.color.card,
                        color: STheme.color.text,
                    }}
                        // infoStyle={{
                        //     color: STheme.color.text,
                        //     fontSize: 12,
                        // }}
                        required
                        ref={r => this._ref["hora_inicio"] = r}
                        keyboardType="numeric"
                        label='Hora de inicio'
                        labelStyle={{ color: STheme.color.text, fontSize: 12, fontFamily: "roboto", marginTop: 10 }}
                        placeholder="HH:MM"
                        filter={this.filterHorario.bind(this)}
                        onPress={(e) => {
                            InputFloat.open({
                                e: e, width: 120, height: 160,
                                style: {
                                    backgroundColor: STheme.color.background,
                                    borderRadius: 4
                                },
                                render: () => {
                                    return <SView flex height card>
                                        <InputHora defaultValue={this._ref["hora_inicio"].getValue()} onChange={val => {
                                            if (this._ref["hora_inicio"]) {
                                                this._ref["hora_inicio"].setValue(val)
                                            }
                                        }} />
                                    </SView>
                                }
                            });
                        }}
                    // onChangeText={e => {
                    //     // this._ref["hora_inicio"].setValue(e);
                    //     this.state.hora_fin = e
                    // }}
                    />
                    {/* <SInput ref={r => this._ref["fecha_fin"] = r} defaultValue={this.state.fecha} col={"xs-5.5"} type='date' label={"Fecha Fin"} required placeholder={"yyyy-MM-dd"} />
                    <SInput ref={r => this._ref["hora_fin"] = r} col={"xs-5.5"} label={" "} defaultValue={"23:59"} placeholder={"hh:mm"} required onChangeText={(e => {
                        const resp = this.filterHorario(e);
                        if (resp != e) {

                            this._ref["hora_fin"].setValue(resp);
                        }
                        // return this.filterHorario(e);
                    })} /> */}
                </SView>
                <SHr h={16} />

                <SView row col={"xs-12"} center>
                    {this.state.pk ? <>
                        {/* <SButtom onPress={() => {
                            SNavigation.navigate("/staff/profile", { pk: this.state.pk })
                        }} type='secondary'><SText language={{
                            es: "INVITAR",
                            en: "INVITE"
                        }} /></SButtom> */}
                        <SView width={30} />
                        <SButtom onPress={this.handleEliminar.bind(this)} type='danger'>
                            <SText language={{
                                es: "ELIMINAR",
                                en: "DELETE"
                            }} color={STheme.color.white} /></SButtom>
                        <SView width={30} />
                    </> : null}

                    <SButtom onPress={this.handlePress.bind(this)} type='secondary'><SText color={STheme.color.white} language={{
                        es: "GUARDAR",
                        en: "SAVE"
                    }} /></SButtom>

                </SView>

            </Container>
            <SHr h={30} />
        </SPage >
    }
}
