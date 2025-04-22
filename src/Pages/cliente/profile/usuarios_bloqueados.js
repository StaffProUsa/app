import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SLanguage, SNavigation, SPage, SPopup, STheme } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table';
import FloatButtom from '../../../Components/FloatButtom';
import { component } from '../../../Services/Usuario/Components/datoCabecera';
import Config from '../../../Config';
import Model from '../../../Model';

export default class usuarios_bloqueados extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    key_cliente = SNavigation.getParam("key_cliente");
    key_company = SNavigation.getParam("key_company");
    componentDidMount() {


    }

    async loadData() {
        const resp = await SSocket.sendPromise({
            component: "usuario_bloqueado_cliente",
            type: "getAll",
            key_cliente: this.key_cliente
        })

        let ks = Object.values(resp.data).map((a) => a.key_usuario).filter(key => key !== null);
        ks = [...ks, ...Object.values(resp.data).map((a) => a.key_usuario_bloqueado).filter(key => key !== null)]
        let keys = [...new Set(ks.filter(key => key !== null))]


        const request = {
            version: "2.0",
            service: "usuario",
            component: "usuario",
            type: "getAllKeys",
            keys: keys,
        }
        const response = await SSocket.sendPromise(request)
        const dataUsuarios = Object.values(response.data).map((a) => a.usuario);

        const data = Object.values(resp.data).map((a) => {
            let usuario_bloqueado = dataUsuarios.find((b) => b.key == a.key_usuario_bloqueado);
            let usuario = dataUsuarios.find((b) => b.key == a.key_usuario);
            return {
                ...a,
                usuario: usuario,
                usuario_bloqueado: usuario_bloqueado,
            }
        })

        return data;
    }
    render() {
        return <SPage title={"Usuarios bloqueados"} disableScroll>
            <DinamicTable
                ref={ref => this.table = ref}
                loadData={this.loadData.bind(this)}
                colors={Config.table.styles()}
                cellStyle={Config.table.cellStyle()}
                textStyle={Config.table.textStyle()}
                selectType='single'
                onSelect={(a) => {
                    console.log(a);
                    SPopup.confirm({
                        title: SLanguage.select({
                            es: "¿Desea desbloquear al usuario?",
                            en: "Do you want to unlock the user?"
                        }),
                        onPress: () => {
                            SSocket.sendPromise({
                                component: "usuario_bloqueado_cliente",
                                type: "editar",
                                data: {
                                    key: a?.row?.key,
                                    estado: 0,
                                }
                            }).then(e => {
                                this.table.loadData();
                                console.log(e);
                            }).catch(e => {
                                console.error(e);
                            })
                        }
                    })
                }}
            >
                <DinamicTable.Col key="key_usuario" label='key' data={a => a.row.key_usuario} textStyle={{
                    fontSize: 10,
                    color: STheme.color.lightGray
                }} />
                <DinamicTable.Col key="Nombres" label={SLanguage.select({
                    es: "Nombres",
                    en: "First Name"
                })} data={a => a.row?.usuario_bloqueado?.Nombres} />
                <DinamicTable.Col key="Apellidos" label={SLanguage.select({
                    es: "Apellidos",
                    en: "Last Name"
                })} data={a => a.row?.usuario_bloqueado?.Apellidos} />
                <DinamicTable.Col key="Correo" label={SLanguage.select({
                    es: "Correo",
                    en: "Email"
                })} width={180}
                    data={a => a.row?.usuario_bloqueado?.Correo} />
                <DinamicTable.Col key="Telefono" label={SLanguage.select({
                    es: "Telefono",
                    en: "Phone"
                })} width={100}
                    data={a => a.row?.usuario_bloqueado?.Telefono} />
                <DinamicTable.Col key={"fecha"}
                    label={SLanguage.select({ es: "Fecha de bloqueo", en: "Date of block" })}
                    width={140}
                    dataType='date'
                    data={e => new SDate(e.row?.fecha_on, "yyyy-MM-ddThh:mm:ss").date}
                    format={e => new SDate(e.data).toString("yyyy-MM-dd hh:mm:ss")} />
                <DinamicTable.Col key={"bloqueado_por"}
                    label={SLanguage.select({ es: "Bloqueado por", en: "Blocked by" })}
                    width={140}
                    data={e => e.row?.usuario?.Nombres + " " + e.row?.usuario?.Apellidos} />
            </DinamicTable>
            <FloatButtom onPress={() => {
                SNavigation.navigate("/company/profile/users", {
                    pk: this.key_company, onSelect: (a) => {
                        console.log(a);
                        SNavigation.goBack();

                        SSocket.sendPromise({
                            component: "usuario_bloqueado_cliente",
                            type: "registro",
                            data: {
                                key_cliente: this.key_cliente,
                                key_usuario: a.key_usuario,
                                key_usuario_bloqueado: Model.usuario.Action.getKey(),
                                estado: 1
                            }
                        }).then(e => {
                            console.log(e); this.table.loadData();
                        }).catch(e => {
                            console.error(e);
                        })
                    }
                })
            }} />
        </SPage>
    }
}
