import React, { Component, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SInput, SText, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';

const getData = () => {
    return [
        { key: 1, },
        { key: 2, },
        { key: 3, },
        { key: 3, },
        { key: 5, },
    ]
}


class TextInput extends Component {
    state = {
        color: "#fff"
    }
    setColor(color) {
        this.setState({ color: color })
    }
    getValue() {
        return this.refe.getValue()
    }
    render() {
        return <SInput style={{
            backgroundColor: this.state.color
        }} ref={recv => this.refe = recv} />
    }
}

export default class t2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cantidadr: 0,
            label: "hola"
        };
    }


    componentDidMount() {
        
        const data = getData();
        this.setState({ data: data })
        this.ready = true;
    }
    componentWillUnmount() {
        
        this.ready = false;
    }

    hilo() {
        if (!this.ready) return;

        this.hilo();
    }
    handleHola() {
        this.state.label = "chau"
        this.state.algomas = "chau"
        this.setState({ ...this.state })
        // this.setState({ label: "chau" })
    }

    render() {
        this.state.cantidadr += 1;
        return <SView>
            <SText>{this.state.cantidadr}</SText>
            <SInput onChangeText={(e) => {
                this.setState({ value:e })
            }} />
            {/* <TextInput o  ref={recv => this.ref_input = recv} /> */}
            <SButtom type='danger' onPress={() => {
                let value = this.ref_input.getValue();
                if (!value) {
                    this.ref_input.setColor("#F00")
                } else {
                    this.ref_input.setColor("#000")
                }
                // alert(value)
            }}>VER</SButtom>
            
        </SView>
        // return <SText fontSize={40} onPress={this.handleHola.bind(this)}>{JSON.stringify(this.state)}</SText>
    }
}



// const t2 = () => {
//     const [state, setState] = useState({
//         label: "hola"
//     });

//     useEffect(() => {
//         const data = getData();
//         setState({ ...state, data: data })

//     }, [])
//     const handleHola = () => {
//         state.label = "chau"
//         state.algo_mas = "sadksankd"
//         setState({ ...state })
//     }
//     return <SText fontSize={40} onPress={handleHola}>{JSON.stringify(state)}</SText>
// }

// export default t2;