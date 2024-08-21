import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SDate, SIcon, SLoad, SPage, SText, STheme, SThread, SView, SNavigation, SImage } from 'servisofts-component';
import parametro from '../../../Services/Casagrandeadmin/Components/parametro';
import venta from '../../../Services/Casagrandeadmin/Components/venta';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';

class EventoStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curtime: new SDate()
        };
    }

    componentDidMount() {
        this.state.run = true;
        this.requestData();
    }
    componentWillUnmount() {
        this.state.run = false;
    }
    requestData() {

        SSocket.sendPromise({
            component: "staff",
            type: "getAll",
            key_evento: SNavigation.getParam("key"),
            key_usuario: Model.usuario.Action.getUsuarioLog()
        }).then(e => {
            // if (e.data.length <= 0) {
            //   this.state.endData = true;
            // }
            // this.state.dataTipo = [...this.state.dataTipo, ...e.data]
            this.setState({ data: Object.values(e.data), refreshing: false })
        }).catch(e => {
            // this.setState({ refreshing: false })
        })

    }

    render() {

        return (
            <SView col={'xs-12'} border={'transparent'} center row>
                <FlatList
                    // refreshControl={
                    //     <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
                    // }
                    data={this.state.data}
                    keyExtractor={item => item.key.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    // numColumns={2}
                    renderItem={({ item, index }) => {
                        if(item.estado == "0") return <></>
                        return <>
                            <SView col={"xs-12"} row center>
                                <SView col={"xs-3"} center>
                                    <SImage src={SSocket.api.root + 'staff/' +  item.key_staff_tipo} style={{
                                        resizeMode: "cover", width: 50, height: 50,
                                        borderRadius: 6,
                                        overflow: "hidden",
                                        borderColor: STheme.color.darkGray,
                                        borderWidth: 1
                                    }} />
                                </SView>
                                <SView col={"xs-3"} >
                                <SText color={STheme.color.text}>{item.descripcion}</SText>
                                </SView>
                                <SView col={"xs-3"} center>
                                    <SText color={STheme.color.gray}>X {item.cantidad}</SText>
                                </SView>
                                <SView col={"xs-3"} center>
                                    <SView width={85} height={45} style={{backgroundColor:STheme.color.secondary, borderRadius:16}} center>
                                    <SText color={STheme.color.text}>Apply</SText>
                                    </SView>
                                </SView>

                            </SView>


                        </>
                    }}
                />
            </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(EventoStaff);