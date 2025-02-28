import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SHr, SIcon, SText, STheme, SView } from 'servisofts-component';
import InputFecha from '../../../Components/NuevoInputs/InputFecha';
import Input from '../../../Components/Input';
import InputFloat from '../../../Components/NuevoInputs/InputFloat';
import InputHora from '../../../Components/NuevoInputs/InputHora';
import { Btn } from '../../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';

export default class EditClock extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.input = {};
        this.input_fecha = {};
    }

    renderFechaHora({ fecha, key }) {
        if (!fecha) return null;
        const sfecha = new SDate(fecha, "yyyy-MM-ddThh:mm:ssTZD")
        return <SView row center col={"xs-12"}>
            <InputFecha
                ref={ref => this.input_fecha[key] = ref}
                defaultValue={sfecha.toString("yyyy-MM-dd")}
                onChange={(e) => {
                    console.log(e);
                }} />
            <SView width={4} />
            <SText>{":"}</SText>
            <SView width={4} />
            <Input height={40} inputStyle={{
                width: 50,
                borderRadius: 4,
                backgroundColor: STheme.color.card,
                color: STheme.color.text,
            }}
                ref={ref => this.input[key] = ref}
                defaultValue={sfecha.toString("hh:mm")}
                onPress={(e) => {
                    InputFloat.open({
                        e: e, width: 120, height: 160,
                        style: {
                            backgroundColor: STheme.color.background,
                            borderRadius: 4
                        },
                        render: () => {
                            return <SView flex height card>
                                <InputHora defaultValue={sfecha.toString("hh:mm")} onChange={val => {
                                    this.input[key].setValue(val)
                                    // if (this._ref["hora_inicio"]) {
                                    // this._ref["hora_inicio"].setValue(new SDate(val, "hh:mm").toString("HH"))
                                    // }
                                }} />
                            </SView>
                        }
                    });
                }}
            />
        </SView>
    }
    btnAdd({ onPress }) {
        return <SView width={20} height={20} onPress={onPress}>
            <SIcon name='Add' />
        </SView>
    }
    btnDel({ onPress }) {
        return <SView width={20} height={20} onPress={onPress}>
            <SIcon name='Delete' />
        </SView>
    }
    render() {
        console.log(this.props.data)
        const { usuario, staff_usuario } = this.props.data;
        return <SView width={300} height={300} backgroundColor={STheme.color.background} style={{
            borderRadius: 16,
            alignItems: "center"
        }} withoutFeedback padding={8}>
            <SHr h={16} />
            <SText bold fontSize={20}>{usuario?.Nombres} {usuario?.Apellidos}</SText>
            <SHr h={16} />
            <SView col={"xs-12"} row center>
                <SText bold >{"Clock IN"}</SText>
                <SView flex />
                {staff_usuario.fecha_ingreso ? this.btnDel({
                    onPress: () => {
                        staff_usuario.fecha_ingreso = null
                        this.setState({ ...this.state })
                    }
                }) : this.btnAdd({
                    onPress: () => {
                        staff_usuario.fecha_ingreso = new SDate().toString("yyyy-MM-ddThh:mm:ssTZD")
                        this.setState({ ...this.state })
                    }
                })}
            </SView>
            <SHr h={8} />
            {this.renderFechaHora({ fecha: staff_usuario.fecha_ingreso, key: "clockin" })}
            <SHr h={16} />
            <SView col={"xs-12"} row center>
                <SText bold >{"Clock OUT"}</SText>
                <SView flex />
                {staff_usuario.fecha_salida ? this.btnDel({
                    onPress: () => {
                        staff_usuario.fecha_salida = null
                        this.setState({ ...this.state })
                    }
                }) : this.btnAdd({
                    onPress: () => {
                        staff_usuario.fecha_salida = new SDate().toString("yyyy-MM-ddThh:mm:ssTZD")
                        this.setState({ ...this.state })
                    }
                })}
            </SView>
            <SHr h={8} />
            {this.renderFechaHora({ fecha: staff_usuario.fecha_salida, key: "clockout" })}
            <SView flex />
            <Btn width={100} onPress={() => {
                const hora_in = !this.input["clockin"] ? "" : this.input["clockin"].getValue();
                const fecha_in = !this.input_fecha["clockin"] ? "" : this.input_fecha["clockin"].getValue();
                const tz = new SDate().getTimezone();
                let full_in = "";
                if (hora_in && fecha_in) {
                    full_in = fecha_in + "T" + hora_in + ":00" + tz
                }

                let full_out = "";
                const hora_out = !this.input["clockout"] ? "" : this.input["clockout"].getValue();
                const fecha_out = !this.input_fecha["clockout"] ? "" : this.input_fecha["clockout"].getValue();
                if (hora_out && fecha_out) {
                    full_out = fecha_out + "T" + hora_out + ":00" + tz
                }
                console.log(full_in, full_out)
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "editarClock",
                    key_usuario: Model.usuario.Action.getKey(),
                    data: {
                        key: staff_usuario.key,
                        fecha_ingreso: full_in,
                        fecha_salida: full_out
                    }
                }).then(e => {
                    this.props.onChange()
                }).catch(e => {

                })
            }}>SAVE</Btn>
            {/* <SText>{JSON.stringify(this.props.data)}</SText> */}
        </SView>
    }
}
