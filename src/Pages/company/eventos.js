import React from "react";
import { SDate, SHr, SList, SNavigation, SPage, SText, STheme, SView } from "servisofts-component";
import SSocket from "servisofts-socket";
import { Container } from "../../Components";

export default class index extends React.Component {
    key_company = SNavigation.getParam("key_company")
    state = {

    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "evento",
            type: "getEstadoEventos",
            key_company: this.key_company
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {

        })
    }

    renderBarra({ porcentaje, color, key }) {
        return <SView row col={"xs-12"} >
            <SView style={{
                width: "100%",
                height: 14,
                borderRadius: 100,
                backgroundColor: STheme.color.card,
                overflow: 'hidden',
            }} row>
                <SView style={{
                    width: porcentaje + "%",
                    height: "100%",
                    backgroundColor: color ?? STheme.colorFromText(key)
                }} />
            </SView>
        </SView>
    }
    renderItem(obj) {
        return <SView col={"xs-12"} card padding={8} onPress={() => {
            // SNavigation.navigate("admin/evento/perfil", { key: obj.key })
            SNavigation.navigate("/company/event", { key_evento: obj.key })
        }}>
            <SText>{obj.descripcion}</SText>
            <SText color={STheme.color.lightGray}>{obj.observacion}</SText>
            <SHr />
            {this.renderBarra({ color: null, porcentaje: obj.porcentaje_reclutas, key: obj.key + "b" })}
            <SHr />
            {this.renderBarra({ color: null, porcentaje: obj.porcentaje_asistencia, key: obj.key + "a" })}
            <SHr />
            <SText color={STheme.color.lightGray}>{new SDate(obj.fecha).toString("yyyy-MM-dd hh:mm")}</SText>

            {/* <SText color={STheme.color.lightGray}>{new SDate(obj.fecha_on).toString("yyyy-MM-dd hh:mm")}</SText> */}
            {/* <SText>{obj.}</SText> */}
        </SView>
    }
    render() {
        return <SPage titleLanguage={{
            en: "Event list",
            es: "Lista de eventos"
        }}>
            <Container>
                <SList
                    buscador
                    data={this.state?.data}
                    order={[{ key: "fecha", order: "desc" }]}
                    render={this.renderItem.bind(this)}
                />
                {/* <SText>{JSON.stringify(this.state)}</SText> */}
            </Container>
        </SPage>;
    }
}