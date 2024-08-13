import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SDate, SInput, SNavigation, SText, SThread, SView } from 'servisofts-component'

type DataType = {
    fecha_inicio: String,
    fecha_fin: String,
}
type SelectEntreFechasProps = {
    onChange: (data: DataType) => void
} & DataType
export default class SelectEntreFechas extends Component<SelectEntreFechasProps> {
    constructor(props) {
        super(props);

        this.state = {
            fecha_inicio: this.props.fecha_inicio ?? new SDate().toString("yyyy-MM-dd"),
            fecha_fin: this.props.fecha_fin ?? new SDate().toString("yyyy-MM-dd"),
        }


        // this.state.fecha_inicio = SNavigation.getParam("fecha_inicio", SelectEntreFechas.defaultProps.fecha_inicio)
        // this.state.fecha_fin = SNavigation.getParam("fecha_inicio", SelectEntreFechas.defaultProps.fecha_fin)
    }

    componentDidMount() {
        new SThread(100, "kekeke").start(() => {
            this.props.onChange(this.state)
        })
    }

    handleChange(key, e) {
        // this.setState({ fecha_fin: e })
        // console.log(e, key)
        if (this.state[key] == e) return;
        this.state[key] = e;
        this.props.onChange(this.state)

    }
    render() {
        return <SView col="xs-12" row >
            <SView row col={"xs-12 sm-6"} padding={4} center>
                <SText>Desde: </SText>
                <SInput flex type='date' style={{
                    padding: 0
                }} height={30} defaultValue={this.state.fecha_inicio} onChangeText={this.handleChange.bind(this, "fecha_inicio")} />
            </SView>
            <SView row col={"xs-12 sm-6"} padding={4} center>
                <SText>Hasta: </SText>
                <SInput flex type='date' height={30} style={{
                    padding: 0
                }} defaultValue={this.state.fecha_fin} onChangeText={this.handleChange.bind(this, "fecha_fin")} />
            </SView>
        </SView>
    }
}