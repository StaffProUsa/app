import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SInput, SLanguage, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import { Container } from '../../Components';
import InputFecha from '../../Components/NuevoInputs/InputFecha';
import InputSelect from '../../Components/NuevoInputs/InputSelect';
import Input from '../../Components/Input';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
import InputHora from '../../Components/NuevoInputs/InputHora';
import SIconApp from '../../Assets/SIconApp';

export default class registro2 extends Component {

    key_company = SNavigation.getParam('key_company');
    key_cliente = SNavigation.getParam('key_cliente');

    state = {

        bookings: [
            {}
        ],
    }
    data = {

    }
    handlePress() {

    }
    render() {
        return <SPage title={"Registro 2"}>
            <Container>
                <SView col={"xs-12"}>
                    <SHr h={16} />
                    <SText language={{ en: "Date", es: "Fecha" }} />
                    <SHr />
                    <InputFecha ref={ref => this.inpFecha = ref}
                        defaultValue={new SDate(this.data['fecha'], "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") ?? new SDate().toString("yyyy-MM-dd")}
                        onChange={(e) => {
                            console.log(e);
                        }} />

                    <SInput label={SLanguage.select({
                        es: "Nombre del evento",
                        en: "Event name"
                    })} />
                    <SInput label={SLanguage.select({
                        es: "Información sobre el evento",
                        en: "Information about the event"
                    })} type='textArea' />
                    <SHr h={64} />
                    <SView col={"xs-12"} row>
                        <SText fontSize={18} flex bold underLine language={{ en: "Booking", es: "Reclutas" }} />
                        <SView width={30} height={30} onPress={() => {
                            this.state.bookings.push({});
                            this.setState({ bookings: this.state.bookings })
                        }} >
                            <SIconApp name='Add' />
                        </SView>
                    </SView>
                    {this.state.bookings.map((item, index) => <InputPosition
                        key={index+"booking"}
                        key_company={this.key_company}
                        onDelete={() => {
                            this.state.bookings.splice(index, 1);
                            this.setState({ bookings: this.state.bookings })
                        }}
                    />)}

                </SView>
                <SHr h={64} />
                <SButtom onPress={this.handlePress.bind(this)} type='secondary'>
                    {this.state.loading ? <SLoad /> : <SText color={STheme.color.white} language={{ es: "GUARDAR", en: "SAVE" }} />}
                </SButtom>
            </Container>
        </SPage>
    }
}



const formatTime = (time) => {
    if (!time) return;
    // Eliminar caracteres no numéricos, no ':' y no 'am/pm'
    let filtered = time.toLowerCase().replace(/[^0-9:apm]/g, '');

    // Verificar si tiene "am" o "pm" y eliminarlo temporalmente
    const isPM = filtered.includes('pm');
    const isAM = filtered.includes('am');
    filtered = filtered.replace(/am|pm/g, '').trim();

    // Separar en partes
    const parts = filtered.split(':');
    let hh = parts[0] || '';
    let mm = parts[1] || '';

    // Agregar ceros a la izquierda si es necesario
    hh = hh.padStart(2, '0');
    mm = mm.padStart(2, '0');

    // Convertir a formato de 24 horas si es necesario
    if (isPM && hh !== '12') {
        hh = String(parseInt(hh, 10) + 12).padStart(2, '0');
    } else if (isAM && hh === '12') {
        hh = '00';
    }

    // Limitar los valores de las horas y minutos
    if (parseInt(hh, 10) > 23) hh = '23';
    if (parseInt(mm, 10) > 59) mm = '59';

    // Unir de nuevo si no tiene minutos
    if (filtered.includes(':')) {
        return `${hh}:${mm}`;
    }
    return `${hh}:00`; // Si no incluye ':', asumir minutos '00'
};

class InputPosition extends Component {
    _ref = {}

    state = {

    }
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

    render() {
        return <SView col={"xs-12"} row style={{
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: STheme.color.card,
            paddingBottom: 16,
        }}>
            <SInput
                ref={r => this._ref["tipo"] = r}
                label={SLanguage.select({
                    es: "Tipo de Staff",
                    en: "Staff Type"
                })}
                col={"xs-5.5"}
                editable={false}
                placeholder={SLanguage.select({
                    es: "Tipo de Staff",
                    en: "Staff Type"
                })}
                required
                
                onPress={() => {
                    SNavigation.navigate("/staff_tipo", {
                        key_company: this.props.key_company, onSelect: (e) => {
                            const input = this._ref["tipo"];
                            input.setValue(e.descripcion)
                            input.setData(e);
                        }
                    })
                }} />
            <SInput
                ref={r => this._ref["cantidad"] = r}
                type='number'
                defaultValue={1}
                col={"xs-3"}
                label={SLanguage.select({
                    es: "Cantidad",
                    en: "Quantity"
                })} required placeholder={"0"} />


            <Input col={"xs-3"} inputStyle={{
                height: 40,
                borderRadius: 4,
                backgroundColor: STheme.color.card,
                color: STheme.color.text,
            }}
                // infoStyle={{
                //     color: STheme.color.text,
                //     fontSize: 12,
                // }}

                ref={r => this._ref["nivel_ingles"] = r}

                label={SLanguage.select({ en: "English level", es: "Nivel de ingles" })}
                labelStyle={{ color: STheme.color.text, fontSize: 12, fontFamily: "roboto", marginTop: 10 }}
                placeholder={SLanguage.select({ en: "English level", es: "Nivel de ingles" })}
                // filter={this.filterHorario.bind(this)}
                onPress={(e) => {
                    InputFloat.open({
                        e: e,
                        height: 180,
                        width: 150,
                        style: {
                            backgroundColor: STheme.color.primary,
                        },
                        render: () => {

                            return <SView col={"xs-12"} flex card>
                                <InputSelect
                                    data={["NONE", "BASIC", "MEDIUM", "ADVANCED"]}
                                    onChange={val => {
                                        if (this._ref["nivel_ingles"]) {
                                            this._ref["nivel_ingles"].setValue(val)
                                        }
                                    }}
                                    ITEM_HEIGHT={30} />
                            </SView>
                        }
                    })
                }}
            />

            <Input col={"xs-4"} inputStyle={{
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
                label={SLanguage.select({
                    en: "Start time",
                    es: "Hora de inicio"
                })}
                labelStyle={{ color: STheme.color.text, fontSize: 12, fontFamily: "roboto", marginTop: 10 }}
                placeholder="HH:MM"
                // filter={this.filterHorario.bind(this)}
                onPress={(e) => {
                    InputFloat.open({
                        e: e, width: 120, height: 160,
                        style: {
                            backgroundColor: STheme.color.background,
                            borderRadius: 4
                        },
                        render: () => {
                            return <SView flex height card>
                                <InputHora defaultValue={formatTime(this._ref["hora_inicio"].getValue())} onChange={val => {
                                    this.state.startTime = val;

                                    if (this._ref["hora_inicio"]) {
                                        console.log(val);
                                        this._ref["hora_inicio"].setValue(new SDate(val, "hh:mm").toString("HH"))
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
            <SView width={10} />
            <Input col={"xs-4"} inputStyle={{
                height: 40,
                borderRadius: 4,
                backgroundColor: STheme.color.card,
                color: STheme.color.text,
            }}
                // infoStyle={{
                //     color: STheme.color.text,
                //     fontSize: 12,
                // }}
                ref={r => this._ref["hora_fin"] = r}
                //   required
                keyboardType="numeric"
                label={SLanguage.select({
                    en: "End time",
                    es: "Hora de fin"
                })}
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
                                <InputHora defaultValue={formatTime(this._ref["hora_fin"].getValue())} onChange={val => {
                                    this.state.endTime = val;

                                    if (this._ref["hora_fin"]) {
                                        this._ref["hora_fin"].setValue(new SDate(val, "hh:mm").toString("HH"))
                                        // this._ref["hora_fin"].setValue(val)
                                    }
                                }} />
                            </SView>
                        }
                    });
                }}
            />
            <SView flex />
            <SView width={30} >
                <SHr h={36} />
                <SView width={30} height={30} onPress={this.props.onDelete}>
                    <SIconApp name='Delete' />
                </SView>
            </SView>
        </SView>
    }
}   