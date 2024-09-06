import React from "react";
import { SDate, SHr, SList, SNavigation, SPage, SText, STheme, SUtil, SView } from "servisofts-component";
import SSocket from "servisofts-socket";
import { Container } from "../../Components";

const getColorFromPercentage = (percentage) => {
    // Asegurarse de que el valor esté entre 0 y 100
    percentage = Math.max(0, Math.min(percentage, 100));

    let r, g;

    if (percentage < 50) {
        // De 0 a 50, rojo (255, 0, 0) a amarillo (255, 255, 0)
        r = 255;
        g = Math.floor((percentage / 50) * 255);
    } else {
        // De 50 a 100, amarillo (255, 255, 0) a verde (0, 255, 0)
        r = Math.floor(255 - ((percentage - 50) / 50) * 255);
        g = 255;
    }

    // El color siempre tiene el componente azul en 0
    return `rgb(${r}, ${g}, 0)`;
}

export default class index extends React.Component {
    key_company = SNavigation.getParam("key_company")
    state = {

    }
    componentDidMount() {
        this.setState({ loading: true })
        SSocket.sendPromise({
            component: "evento",
            type: "getEstadoEventos",
            key_company: this.key_company
        }).then(e => {
            this.setState({ data: e.data, loading: false })
        }).catch(e => {
            this.setState({ loading: false })
        })
    }

    renderBarra({ porcentaje, color, key }) {
        return <SView row col={"xs-12"} >
            <SView flex center>
                <SView style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 100,
                    backgroundColor: STheme.color.card,
                    overflow: 'hidden',
                }} >
                    <SView
                        width={parseFloat(porcentaje ?? 0) + "%"}
                        style={{
                            height: "100%",
                            backgroundColor: getColorFromPercentage(porcentaje)
                        }} />
                </SView>
            </SView>
            <SView width={40} style={{
                alignItems: "flex-end"
            }}>
                <SText>{porcentaje ?? 0}%</SText>
            </SView>
        </SView>
    }
    renderItem(obj) {
        return <SView col={"xs-12"} card padding={8} onPress={() => {
            // SNavigation.navigate("admin/evento/perfil", { key: obj.key })
            SNavigation.navigate("/company/event", { key_evento: obj.key })
        }}>
            <SText fontSize={16} bold>{obj.descripcion}</SText>
            <SText color={STheme.color.lightGray}>{SUtil.limitString(obj.observacion, 200, "...")}</SText>
            <SHr />
            <SText>{`Reclutas ${obj.actual ?? 0}/${obj.cantidad ?? 0}`}</SText>
            <SHr h={6} />
            {this.renderBarra({ color: null, porcentaje: obj.porcentaje_reclutas, key: obj.key + "b" })}
            <SHr />
            <SText>{`Asistencias ${obj.asistencias ?? 0}/${obj.actual ?? 0}`}</SText>
            <SHr h={6} />
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
        }}
            onRefresh={(e) => {
                this.componentDidMount();
                if(e) e();
            }}>
            <Container loading={this.state.loading}>
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