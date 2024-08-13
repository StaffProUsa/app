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

    getVisitas = async() => {
        return  await new Promise((resolve)=>{
            const request = {
                component: "reportes",
                type: "visitas_por_evento",
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
        this.state.visitas = await this.getVisitas();

        let keys_usuario = [...new Set(Object.values(this.state.visitas).map(a => a.key_usuario).filter(key => key !== null))];

        keys_usuario = [...new Set([...keys_usuario])];
        
        this.state.usuarios = await this.getUsuarios(keys_usuario);

        Object.values(this.state.visitas).map(visita => {
            if(this.state.usuarios[visita.key_usuario]){
                visita.usuario = this.state.usuarios[visita.key_usuario]["usuario"];
            }
        })
        console.log(this.state.visitas)
        this.setState({...this.state})
    }


    getTable() {
        if (!this.state) return <SLoad />
        if (this.state.error) return <SText color={STheme.color.danger}>{this.state.error}</SText>
        if (!this.state.visitas) return <SLoad />
        return <STable2
            rowHeight={24}
            headerColor='#666'
            cellStyle={{
                fontSize: 14,
                padding: 2,
            }}
            header={[
                { key: "index", width: 30 },
                { label:"OS", key: "data/OS", width: 180, order:"desc" },
                { label:"Dispositivo", key: "data/descripcion", width: 180, order:"desc" },
                { label:"Version", key: "data/version", width: 180, order:"desc" },
                { label:"Nombres", key: "usuario/Nombres", width: 120 },
                { label:"Apellidos", key: "usuario/Apellidos", width: 120 },
                { label:"Telefono", key: "usuario/Telefono", width: 120 },
                { label:"Correo", key: "usuario/Correo", width: 120 },
                { label:"Fecha", key: "fecha_on", width: 180, order:"desc" },
               
            ]}
            limit={50}
            data={this.state?.visitas} />
    }
    render() {
        return (
            <SPage title="Reporte de visitas" disableScroll>
                <SView flex>
                    {this.getTable()}
                </SView>
            </SPage>
        )
    }
}