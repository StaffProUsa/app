import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SInput, SNavigation, SPage, SText, SView } from 'servisofts-component';
import { Container } from '../../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';



const Item = ({ data, onChange }) => {
    return <SView padding={10} row center>
        <SView width={20} height={20} >
            <SInput type='checkBox' defaultValue={!!data.staff_tipo_company} onChangeText={onChange} />
        </SView>
        <SView width={4} />
        <SText>{data.descripcion}</SText>
    </SView>
}

export default class staff_tipo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_company: SNavigation.getParam("pk")
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "staff_tipo",
            type: "getAll",
        }).then(e => {
            SSocket.sendPromise({
                component: "staff_tipo_company",
                type: "getAll",
                key_company: this.state.key_company
            }).then(b => {
                Object.values(b.data).map(a => {
                    const st = Object.values(e.data).find(x => x.key == a.key_staff_tipo);
                    if (st) {
                        st.staff_tipo_company = a;
                    }
                })
                this.setState({ data: e.data })
            }).catch(e => {

            })

        }).catch(e => {

        })
    }

    render() {
        return <SPage title={"Staff Tipo"} disableScroll>
            <Container flex>
                <FlatList data={Object.values(this.state.data ?? {})}
                    contentContainerStyle={{
                        flexDirection: "row",
                        width: "100%",
                        flexWrap: "wrap"
                    }}
                    renderItem={({ item }) => <Item data={item} onChange={(bol => {
                        if (bol) {
                            SSocket.sendPromise({
                                component: "staff_tipo_company",
                                type: "registro",
                                data: {
                                    key_company: this.state.key_company,
                                    key_staff_tipo: item.key,
                                },
                                key_usuario: Model.usuario.Action.getKey()
                            }).then(e => {
                                item.staff_tipo_company = e.data;
                            }).catch(e => {

                            })
                        } else {
                            SSocket.sendPromise({
                                component: "staff_tipo_company",
                                type: "editar",
                                data: {
                                    key: item.staff_tipo_company.key,
                                    estado: 0,
                                },
                                key_usuario: Model.usuario.Action.getKey()
                            })
                        }

                    })} />} />
            </Container>
        </SPage>
    }
}
