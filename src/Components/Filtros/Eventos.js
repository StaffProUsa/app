import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SDate, SIcon, SInput, SNavigation, SText, STheme, SThread, SView } from 'servisofts-component'

type DataType = {
    key_evento: String,
    data: Array<any>,
}
type EventosProps = {
    onChange: (e: { key_evento: string; }) => void;
    key_evento: string;
    data: Array<any>;
} & DataType
export default class Eventos extends Component<EventosProps> {
    constructor(props) {
        super(props);

        this.state = {
            // fecha_inicio: this.props.fecha_inicio ?? new SDate().toString("yyyy-MM-dd"),
            // fecha_fin: this.props.fecha_fin ?? new SDate().toString("yyyy-MM-dd"),
            key_evento: this.props.key_evento ?? "all",
            data: this.props.data ?? [],
        }


        // this.state.fecha_inicio = SNavigation.getParam("fecha_inicio", SelectEntreFechas.defaultProps.fecha_inicio)
        // this.state.fecha_fin = SNavigation.getParam("fecha_inicio", SelectEntreFechas.defaultProps.fecha_fin)
    }

    componentDidMount() {
        new SThread(100, "kekeke").start(() => {
            this.props.onChange(this.state)
        })
    }

    agruparEventosUnicos(data) {
        const eventosMap = new Map();

        data.forEach(item => {
            const evento = item.evento;
            if (!eventosMap.has(evento.key)) {
                eventosMap.set(evento.key, evento);
            }
        });


        // return Array.from(eventosMap.values());
        return Array.from(eventosMap.values()).sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);

            // Manejo por si alguna fecha es inválida
            if (isNaN(fechaA)) return 1;
            if (isNaN(fechaB)) return -1;

            // Descendente: más reciente primero
            return fechaB - fechaA;
        });
    }

    handleEventoChange(key, e) {
        // this.setState({ fecha_fin: e })
        // console.log(e, key)
        if (this.state[key] == e) return;
        this.state[key] = e;
        this.props.onChange(this.state)

    }
    render() {
        console.log("props eventos", this.props.data)
        console.log("props eventos state", this.state.data)
        return <SView row width={250} padding={4} center>
            {/* <SIcon name='eventos' width={16} height={16} style={{ padding: 4 }} fill={STheme.color.text} /> */}
            <SText language={{ es: "Eventos ", en: "Events " }} />
            <SInput flex type='select' width={200} style={{
                padding: 0,
                textAlign: "center",
                fontSize: 8
            }} height={26} defaultValue={this.state.key_evento}
                onChangeText={this.handleEventoChange.bind(this, "key_evento")}
                // options={[
                //     { key: "opt", component: <SText color={STheme.color.success}>opcion1</SText> },
                //     { key: "opt2", component: <SText color={STheme.color.danger}>opcion2</SText> },
                // ]}
                options={[{ key: "", content: "---" }, ...this.agruparEventosUnicos(this.props.data).map(a => { return { key: a.descripcion, content: a.descripcion } })]}
                numberOfLines={1}
            // placeholder={}
            />
        </SView>
    }
}