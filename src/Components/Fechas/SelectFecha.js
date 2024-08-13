import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SDate, SInput, SNavigation, SText, SThread, SView } from 'servisofts-component'

type DataType = {
    fecha: String,
}
type SelectFechaProps = {
    onChange: (data: DataType) => void
} & DataType

export default class SelectFecha extends Component<SelectFechaProps> {
    constructor(props) {
        super(props);

        this.state = {
            fecha: this.props.fecha ?? new SDate().toString("yyyy-MM-dd"),
        }

    }

    componentDidMount() {
        new SThread(100, "kekeke").start(() => {
            this.props.onChange(this.state)
        })
    }

    handleChange(key, e) {
        if (this.state[key] == e) return;
        this.state[key] = e;
        this.props.onChange(this.state)

    }
    render() {
        return <SView col="xs-12" row center>
            <SView row col={"xs-12 sm-6"} padding={4} center>
                <SText>Fecha: </SText>
                <SInput flex type='date' height={30} style={{
                    padding: 0
                }} defaultValue={this.state.fecha} onChangeText={this.handleChange.bind(this, "fecha")} />
            </SView>
        </SView>
    }
}