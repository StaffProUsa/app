import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SNavigation, SText, STheme, SView } from 'servisofts-component';
import InputFecha from '../NuevoInputs/InputFecha';

type FiltroEntreFechasPropsType = {
    onChange: (evt: { fecha_inicio: string, fecha_fin: string }) => void,
    type?: "mes" | "dia"
}
export default class FiltroEntreFechas extends Component<FiltroEntreFechasPropsType> {
    constructor(props) {
        super(props);

        const defaultFechaInicio = new SDate()
        const defaultFechaFin = new SDate()

        if (props.type == "mes") {
            defaultFechaInicio.setDay(1);
        }
        this.state = {
            fecha_inicio: SNavigation.getParam("fecha_inicio", defaultFechaInicio.toString("yyyy-MM-dd")),
            fecha_fin: SNavigation.getParam("fecha_inicio", defaultFechaFin.toString("yyyy-MM-dd"))
        };
    }

    componentDidMount() {
        if (this.props.onChange) this.props.onChange(this.state)
    }
    render() {
        return <SView row col={"xs-12"} center>
            <SText language={{
                en: "FROM:",
                es: "DESDE:"
            }} />
            <SView width={4} />
            <InputFecha ref={ref => this.inpFechaInicio = ref}
                defaultValue={this.state.fecha_inicio}
            />
            <SView width={8} />
            <SText language={{
                en: "TO:",
                es: "HASTA:"
            }} />
            <SView width={4} />
            <InputFecha ref={ref => this.inpFechaFin = ref}
                defaultValue={this.state.fecha_fin}
            />
            <SView width={8} />

            <SView width={4} />
            <SView padding={5} card onPress={() => {
                this.state.fecha_inicio = this.inpFechaInicio.getValue();
                this.state.fecha_fin = this.inpFechaFin.getValue();
                // this.componentDidMount();
                if (this.props.onChange) this.props.onChange(this.state)
            }} style={{
                backgroundColor: STheme.color.secondary
            }} row center>
                <SIcon name='Search' width={18} fill={STheme.color.white} />
                <SView width={4} />
                <SText color={STheme.color.white} language={{
                    en: "SEARCH",
                    es: "BUSCAR"
                }} />
            </SView>
        </SView>
    }
}
