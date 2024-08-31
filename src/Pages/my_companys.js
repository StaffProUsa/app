import React from "react";
import { SNotification, SPage, SText, STheme, SView } from "servisofts-component";
import SSocket from "servisofts-socket";
import Model from "../Model";
import { FlatList } from "react-native";

export default class index extends React.Component {
    state = {}
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        SSocket.sendPromise({
            component: "usuario_company",
            type: "getCompanys",
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            SNotification.send({
                title: "Error",
                body: e.error ?? "Ocurrio un error al optener las companys",
                color: STheme.color.danger,
                time: 5000
            })
        })

    }
    render() {
        return <SPage title={"My Companys"}>
            <FlatList
                data={Object.values(this.state?.data ?? {})}
                renderItem={({ item }) => {
                    return <SView col={"xs-12"} card>
                        <SText>{item?.company?.descripcion}</SText>
                        <SText>Mi Rol: {item.key_rol}</SText>
                    </SView>
                }}
            />
        </SPage>;
    }
}