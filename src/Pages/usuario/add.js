import React from "react";
import { SForm, SInput, SNavigation, SPage, SText, SThread } from "servisofts-component";
import { Container } from "../../Components";
import SSocket from "servisofts-socket";
import usuario from ".";
import Model from "../../Model";

export default class index extends React.Component {
    pk = SNavigation.getParam("pk");
    componentDidMount() {
        if (this.pk) {

        }
    }
    render() {
        return <SPage title={"Nuevo usuario"}>
            <Container>
                <SForm
                    row
                    ref={(formInstance: SForm) => {
                        new SThread(100, "asd").start(() => {
                            if (formInstance) formInstance.focus("Nombres")
                        })
                    }}
                    style={{
                        justifyContent: "space-between"
                    }}
                    inputs={{
                        "Nombres": { col: "xs-5.8", label: "Nombres *", required: true },
                        "Apellidos": { col: "xs-5.8", label: "Apellidos" },
                        "CI": { col: "xs-5.8", label: "Numero de identidad", placeholder: "_ _ _ _ _ _ _" },
                        "Correo": { col: "xs-9.5", type: "email", label: "Correo", placeholder: "correo@example.com" },
                        "Telefono": { col: "xs-5.8", type: "telefono", label: "Telefono", defaultValue: "+1 " },
                    }} onSubmit={(val) => {
                        if (val.Telefono.length <= 6) {
                            delete val.Telefono
                        }
                        SSocket.sendPromise({
                            service: "usuario",
                            version: "2.0",
                            component: "usuario",
                            type: "registro",
                            cabecera: "usuario_app",
                            estado: "cargando",
                            data: {
                                ...val
                            },
                        }).then(e => {
                            Model.usuario.Action._dispatch(e);
                            // SNavigation.goBack();
                            SNavigation.replace("/usuario/profile", { pk: e?.data?.key })
                            console.log(e);
                        }).catch(e => {
                            console.log(e);
                        })
                    }}
                    onSubmitName={"GUARDAR"}
                />
            </Container>
        </SPage>;
    }
}