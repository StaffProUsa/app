import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SInput, SNavigation, SPage, SText, STheme, SView, SNotification, SLanguage, SHr, SIcon, SBuscador } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import MDL from '../../MDL';



const Item = ({ data, onChange }) => {
    // if (!data.descripcion) return null;
    // console.log("data ", data)
    // console.log("mostra ", data.staff_tipo_favorito + " descripcion " + data.descripcion)
    return <SView padding={10} row center>
        <SView width={20} height={20} >
            <SInput type='checkBox' defaultValue={!!data.staff_tipo_favorito} onChangeText={onChange} width={20} height={20} style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: STheme.color.gray,
                overflow: 'hidden',
            }} />
        </SView>
        <SView width={4} />
        <SText fontSize={16}>{data?.staff_tipo?.descripcion}</SText>
    </SView>
}

export default class staff_tipo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_usuario: SNavigation.getParam("key_usuario", Model.usuario.Action.getKey()),
            key_company: SNavigation.getParam("key_company"),
        };
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        this.loadData();
    }


    async loadData() {

        const respStaffTipo = await SSocket.sendPromise({
            component: "staff_tipo",
            type: "getAll",
        })
        const staffTipo = Object.values(respStaffTipo.data);


        const respStaffTipoDelUsuario = await SSocket.sendPromise({
            component: "staff_tipo_favorito",
            type: "getAll",
            key_usuario: this.state.key_usuario,
        })
        const staffTipoDelUsuario = Object.values(respStaffTipoDelUsuario.data).filter(a => a.key_company == this.state.key_company);




        const respStaffTipoCompany = await SSocket.sendPromise({
            component: "staff_tipo_company",
            type: "getAll",
            key_company: this.state.key_company
        })
        const staffTipoCompany = Object.values(respStaffTipoCompany.data);

        staffTipoCompany.map(a => {
            const st = staffTipo.find(x => x.key == a.key_staff_tipo);
            if (st) {
                a.staff_tipo = st;
            }
            const stDel = staffTipoDelUsuario.find(x => x.key_staff_tipo == a.key_staff_tipo);
            if (stDel) {
                a.staff_tipo_favorito = stDel;
            }

        })


        staffTipoCompany.sort((a, b) => (a?.staff_tipo?.descripcion ?? "").toUpperCase() > (b?.staff_tipo?.descripcion ?? "").toUpperCase() ? 1 : -1)
        this.setState({ data: staffTipoCompany })
        console.log("staffTipoDelUsuario ", staffTipoDelUsuario)
        // console.log("staffTipo ", staffTipo)
        console.log("staffTipoCompany ", staffTipoCompany)
    }


    componentWillUnmount() {
        MDL.validaciones.componentDidMount();
        SLanguage.removeListener(this.onChangeLanguage)
    }

    render() {
        let lenguaje = SLanguage.language;
        // const datafilter = SBuscador.filter({ data: this.state.data ?? {}, txt: this.state.filter })
        // const datafilterStaffCompany = SBuscador.filter({ data: this.state.dataCompanyStaff ?? {}, txt: this.state.filterStaffCompany })

        // console.log("la company ",datafilterStaffCompany)

        return <SPage title={"Staff Tipo"} disableScroll>
            < SHr height={40} />
            <Container flex>
                <SText col={"xs-12"} justify fontSize={18} bold>{(lenguaje == "es") ? "Selecciona tus habilidades o tipos de staff favoritos:" : "Select your favorite skills or staff types:"}</SText>
                <SHr height={20} />
          <SBuscador onChange={(e) => { }}
           data={this.state.data ?? {}}

          />
                <FlatList
                    data={this.state.data}
                    // <FlatList data={Object.values(datafilter ?? {}).sort((a, b) => (a?.descripcion ?? "").toUpperCase() > (b?.descripcion ?? "").toUpperCase() ? 1 : -1)}
                    contentContainerStyle={{
                        flexDirection: "row",
                        // justifyContent: "flex-start",
                        width: "100%",
                        flexWrap: "wrap"
                    }}
                    renderItem={({ item }) => {
                        return <Item data={item}
                            onChange={(bol => {
                                if (bol) {
                                    SSocket.sendPromise({
                                        component: "staff_tipo_favorito",
                                        type: "registro",
                                        data: {
                                            key_usuario: this.state.key_usuario,
                                            key_staff_tipo: item?.staff_tipo?.key,
                                            key_company: this.state.key_company,
                                        },
                                        key_usuario: Model.usuario.Action.getKey()
                                    }).then(e => {
                                        item.staff_tipo_favorito = e.data;
                                        SNotification.send({
                                            title: (lenguaje == "es") ? "Éxito" : "Success",
                                            body: (lenguaje == "es") ? "Se guardaron los cambios" : "Changes saved",
                                            time: 5000,
                                            color: STheme.color.success
                                        })
                                    }).catch(e => {
                                        SNotification.send({
                                            title: (lenguaje == "es") ? "Error" : "Error",
                                            body: e.error ?? (lenguaje == "es") ? "Error desconocido" : "Unknown error",
                                            time: 5000,
                                            color: STheme.color.danger
                                        })

                                    })
                                } else {
                                    SSocket.sendPromise({
                                        component: "staff_tipo_favorito",
                                        type: "editar",
                                        data: {
                                            key: item.staff_tipo_favorito.key,
                                            estado: 0,
                                        },
                                        key_usuario: Model.usuario.Action.getKey()
                                    }).then(e => {

                                        delete item.staff_tipo_favorito
                                        // item.staff_tipo_favorito = null;
                                        SNotification.send({
                                            title: (lenguaje == "es") ? "Éxito" : "Success",
                                            body: (lenguaje == "es") ? "Se guardaron los cambios" : "Changes saved",
                                            time: 5000,
                                            color: STheme.color.success
                                        })
                                    }).catch(e => {
                                        SNotification.send({
                                            title: (lenguaje == "es") ? "Error" : "Error",
                                            body: e.error ?? (lenguaje == "es") ? "Error desconocido" : "Unknown error",
                                            time: 5000,
                                            color: STheme.color.danger
                                        })

                                    })
                                }

                            })} />
                    }} />

                <SView style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    height: 50
                }} onPress={() => {

                    let select = Object.values(this.state.data).filter(e => e.staff_tipo_favorito).length;
                    if (select <= 0) {
                        SNotification.send({
                            title: "Error",
                            body: SLanguage.select({
                                en: "Please select at least one staff type",
                                es: "Por favor selecciona al menos un tipo de staff"
                            }),
                            // body: "Please select at least one staff type",
                            color: STheme.color.danger,
                        })
                        return;
                    }
                    SNavigation.goBack()
                }}>
                    <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
                </SView>
            </Container>
        </SPage >
    }
}
