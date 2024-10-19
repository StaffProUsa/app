import React from "react";
import { SDate, SPage, SText, SView } from "servisofts-component";
import InputSelect from "./InputSelect"
export default class InputHora extends React.Component<{ defaultValue?: string, onChange: (e) => void }> {
    state = {
        hour: "01",
        minute: "01",
        ampm: "AM",

    }
    constructor(props) {
        super(props);
        this.initHoraActual();
    }


    convertToDate() {
        const { hour, minute, ampm } = this.state;

        // Convertir la hora a número
        let hours = parseInt(hour, 10);
        const minutes = parseInt(minute, 10);

        // Convertir al formato de 24 horas
        if (ampm === "PM" && hours < 12) {
            hours += 12;
        } else if (ampm === "AM" && hours === 12) {
            hours = 0; // medianoche
        }

        // Crear un objeto Date con la fecha actual y la hora y minutos modificados
        const currentDate = new Date();
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        return currentDate;
    }
    initHoraActual() {
        let date = new Date();
        if (this.props.defaultValue) {
            date = new SDate("2000-01-01 "+this.props.defaultValue, "yyyy-MM-dd hh:mm").date
        }
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        // Convertir a formato de 12 horas
        hours = hours % 12;
        hours = hours ? hours : 12; // Si es 0, convertir a 12
        // Convertir horas y minutos a cadenas de dos dígitos
        const actualHora = hours < 10 ? `0${hours}` : `${hours}`;
        const actualMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        this.state.hour = actualHora;
        this.state.minute = actualMinutes;
        this.state.ampm = ampm;
    }

    handleOnChange = () => {
        const date = this.convertToDate();
        const d = new SDate(date);
        if (this.props.onChange) this.props.onChange(d.toString("hh:mm"));
    }
    render() {

        const height = 20;
        const ahoras = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        const aminutes = ["00", '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
        const at = ["AM", "PM"]


        return <SView col={"xs-12"} row height>
            <SView col={"xs-4"} height >
                <InputSelect
                    ITEM_HEIGHT={height}
                    data={ahoras}
                    defaultValue={this.state.hour}
                    onChange={e => {
                        this.state.hour = e;
                        this.handleOnChange();
                    }}
                />
            </SView>
            <SView col={"xs-4"} height>
                <InputSelect
                    ITEM_HEIGHT={height}
                    data={aminutes}
                    defaultValue={this.state.minute}
                    onChange={e => {
                        this.state.minute = e;
                        this.handleOnChange();
                    }}
                />
            </SView>
            <SView col={"xs-4"} height>
                <InputSelect
                    ITEM_HEIGHT={height}
                    data={at}
                    defaultValue={this.state.ampm}
                    onChange={e => {
                        this.state.ampm = e;
                        this.handleOnChange();
                    }}
                />
            </SView>
        </SView>
    }
}