import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SText, STheme, SView, SLanguage, SImage, SHr, SIcon, SDate } from 'servisofts-component';
import CardEventoSteps from './CardEventoSteps';
import SSocket from 'servisofts-socket';
import { ObjectStaffUsuario } from '../../MDL/Evento/type';
import Model from '../../Model';


const ItemImage = ({ src, label }) => {
    return <SView row style={{ padding: 2, paddingRight: 16, justifyContent: "center", alignItems: "center" }}>
        <SView style={{
            width: 18,
            height: 18,
            borderRadius: 100,
            backgroundColor: STheme.color.card,
            overflow: "hidden",
        }}>
            <SImage src={src} style={{
                resizeMode: "cover",
            }} />
        </SView>
        <SView width={4} />
        <SText fontSize={12} bold color={STheme.color.lightGray}>{label}</SText>
    </SView>
}

export default class CardBoss extends Component<{ data: ObjectStaffUsuario, onPress?: () => void }> {


    renderItemStatus() {
        const { data } = this.props;
        const fi = new SDate(data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD")
        let lbl = {
            en: "Begins in " + new SDate().timeSince(fi),
            es: "Comienza en " + new SDate().timeSince(fi)
        }
        const styles = {
            color: STheme.color.lightGray,
        }
        if (fi.isBefore(new SDate())) {
            styles.color = STheme.color.success
            const ff = new SDate(data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD")
            lbl = {
                en: "Ends in " + new SDate().timeSince(ff),
                es: "Termina en " + new SDate().timeSince(ff)
            }
            // lbl = {
            //     en: "IN PROGRESS",
            //     es: "EN PROGRESO"
            // }
        }
        return <SView height={18} style={{
            // alignItems: "flex-end",
            backgroundColor: styles.color,
            paddingRight: 8,
            paddingLeft: 8,
            borderRadius: 4
        }} center>
            <SText bold center fontSize={10} color={"#fff"} language={lbl} />
        </SView>

    }
    renderItemInvitation() {
        return <SView height={18} style={{
            backgroundColor: STheme.color.lightBlack,
            paddingRight: 8,
            paddingLeft: 8,
            borderRadius: 4,
        }} center>
            <SText bold center fontSize={10} color={"#fff"} language={{
                en: "BOSS",
                es: "JEFE"
            }} />
        </SView>;


    }
    render() {
        const { data } = this.props;
        let keyUser = data?.staff_usuario?.key_usuario_atiende;
        let dataUser = Model.usuario.Action.getAll()
        let fechaFin = " ---";
        if (data?.staff?.fecha_fin) {
            fechaFin = (new SDate(data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")).toString();
        }
        console.log("fechafin", fechaFin)
        return <SView col={"xs-12"} style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: STheme.color.card
        }} padding={12} onPress={this.props.onPress}>
            <SView col={"xs-12"} row >
                <SView flex>
                    <SView row >
                        <SText fontSize={10} color={STheme.color.lightGray}>{new SDate(data?.evento?.fecha).toString("MONTH dd, yyyy")}</SText>
                        <SView width={16} />
                        <SText fontSize={10} color={STheme.color.lightGray} language={{
                            es: new SDate(data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") + " a " + fechaFin,
                            en: new SDate(data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") + " to " + fechaFin
                        }} />
                    </SView>
                    <SHr height={12} />
                    <SText col={"xs-12"} fontSize={18} bold>{data.evento.descripcion}</SText>

                </SView>
                <SView>
                    {this.renderItemStatus()}
                    <SHr h={4} />
                    {this.renderItemInvitation()}
                </SView>
            </SView>
            <SHr height={12} />
            <SView col={"xs-12"} row>
                <ItemImage src={SSocket.api.root + "company/" + data.company?.key} label={data.company.descripcion} />
                <ItemImage src={SSocket.api.root + "cliente/" + data.cliente?.key} label={data.cliente.descripcion} />
                <ItemImage src={SSocket.api.root + "staff_tipo/" + data.staff_tipo?.key} label={data.staff_tipo.descripcion} />
                {!!data?.staff_usuario?.key_usuario_atiende ? <ItemImage src={SSocket.api.root + "usuario/" + data.staff_usuario.key_usuario_atiende} label={dataUser?.[data.staff_usuario.key_usuario_atiende]?.Nombres + " " + dataUser?.[data.staff_usuario.key_usuario_atiende]?.Apellidos} /> : null}
            </SView>
            <SHr height={12} />
            <SView col={"xs-12"} row style={{
                alignItems: "center"
            }}>
                <SIcon name={"iubicacion" as any} height={16} width={16} fill={STheme.color.text} />
                <SView width={6} />
                <SText col={"xs-10"} fontSize={10} color={STheme.color.lightGray}>{data.cliente.direccion}</SText>
            </SView>
            <SHr height={16} />
            {/* <CardEventoSteps data={data} /> */}
            {/* <SHr height={16} /> */}
        </SView>
    }
}
