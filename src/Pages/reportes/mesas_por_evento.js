import React, { Component } from 'react'
import SSocket from 'servisofts-socket'
import { SDate, SHr, SInput, SLoad, SMath, SNavigation, SPage, STable2, SText, STheme, SView } from 'servisofts-component'
import { SelectEntreFechas } from '../../Components/Fechas'
import { Container } from '../../Components'
import Config from '../../Config'
import { Linking } from 'react-native'
export default class index extends Component {
    state = {
        ...(SNavigation.getAllParams() ?? {}),
    }

    componentDidMount(){
        this.init();
    }

    getUsuarios= async (keys)=>{
        return await new Promise((resolve)=>{
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: keys,
            }).then(e => {
                console.log(e);
                resolve(e.data);
                //this.setState({ data: e.data, loading: false })
            }).catch(e => {
                //this.setState({ error: e?.error })
                resolve(null);
            })
        });
    }

    getMesas = async() => {
        return  await new Promise((resolve)=>{
            const request = {
                component: "reportes",
                type: "mesas_por_evento",
                key_evento: this.state.key_evento,
                estado:"cargando"
            }
            SSocket.sendHttpAsync(SSocket.api.root + "api", request).then(e => {
                resolve(e.data);
            }).catch(e => {
                resolve(null);
            })
        });
    }

    init = async ()=>{
        this.state.mesas = await this.getMesas();

        let keys_usuario = [...new Set(Object.values(this.state.mesas).map(a => a.key_usuario).filter(key => key !== null))];
        let keys_usuario_entrega = [...new Set(Object.values(this.state.mesas).map(a => a.key_usuario_entrega).filter(key => key !== null))];


        keys_usuario = [...new Set([...keys_usuario, ...keys_usuario_entrega])];
        
        this.state.usuarios = await this.getUsuarios(keys_usuario);

        Object.values(this.state.mesas).map(mesa => {
            mesa.usuario = this.state.usuarios[mesa.key_usuario]["usuario"];
            mesa.usuario_entrega = mesa.key_usuario_entrega?this.state.usuarios[mesa.key_usuario_entrega]["usuario"]:null;
        })
        console.log(this.state.mesas)
        this.setState({...this.state})
    }


    getTable() {
        if (!this.state) return <SLoad />
        if (this.state.error) return <SText color={STheme.color.danger}>{this.state.error}</SText>
        if (!this.state.mesas) return <SLoad />
        return <STable2
            rowHeight={24}
            headerColor='#666'
            cellStyle={{
                fontSize: 14,
                padding: 2,
            }}
            header={[
                { key: "index", width: 30 },
                { key: "sector", width: 150, order:"asc" },
                //{ key: "numero", width: 150, order:"asc" },
                { label: "Fecha compra", key: "fecha_on", width: 150 },
                {label:"Comprador Nombre",  key: "usuario/Nombres", width: 150 },
                {label: "Comprador Apellido", key: "usuario/Apellidos", width: 100 },
                {
                    key: "usuario/Telefono",
                    width: 100,
                    label: "Comprador WhatsApp",
                    cellStyle: {
                        color: "#7AD26D"
                    },
                    onPress: (e) => {

                        const link = "https://wa.me/" + e.replace(/\+|\s/g, "");
                        console.log(link);
                        Linking.openURL(link)
                    }
                },
                { label: "Comprador Correo", key: "usuario/Correo", width: 200 },
                
                { label: "Fecha entrega manilla", key: "fecha_entrega", width: 150 },
                {label:"Portero Nombre",  key: "usuario_entrega/Nombres", width: 150 },
                {label: "Portero Apellido", key: "usuario_entrega/Apellidos", width: 100 },
                {
                    key: "usuario_entrega/Telefono",
                    width: 100,
                    label: "Portero WhatsApp",
                    cellStyle: {
                        color: "#7AD26D"
                    },
                    onPress: (e) => {

                        const link = "https://wa.me/" + e.replace(/\+|\s/g, "");
                        console.log(link);
                        Linking.openURL(link)
                    }
                },
                { label: "Portero Correo", key: "usuario_entrega/Correo", width: 200 },
            ]}
            limit={50}
            data={this.state?.mesas} />
    }
    render() {
        return (
            <SPage title="Reporte de mesas" disableScroll>
                <SView flex>
                    {this.getTable()}
                </SView>
            </SPage>
        )
    }
}