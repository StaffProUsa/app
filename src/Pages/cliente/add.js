import React from "react";
import { SForm, SInput, SNavigation, SPage, SText, SThread } from "servisofts-component";
import { Container } from "../../Components";
import SSocket from "servisofts-socket";
import Model from "../../Model";

export default class index extends React.Component {
    state = {}
    pk = SNavigation.getParam("pk");
    key_company = SNavigation.getParam("key_company");
    componentDidMount() {
        if (this.pk) {
            SSocket.sendPromise({
                component: "cliente",
                type: "getByKey",
                estado: "cargando",
                key: this.pk,
                key_usuario: Model.usuario.Action.getKey(),
            }).then(e => {
                // Model.cliente.Action._dispatch(e);
                this.setState({
                    data: e.data
                })
                // SNavigation.goBack();
                // SNavigation.replace("/cliente/profile", { pk: e?.data?.key })
                console.log(e);
            }).catch(e => {
                console.log(e);
            })
        }
    }
    render() {
        return <SPage title={"Nuevo cliente"}>
            <Container loading={(this.pk && !this.state.data)}>
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
                        "descripcion": { col: "xs-7", label: "Nombre del cliente *", required: true, defaultValue: this.state?.data?.descripcion },
                        "nivel_ingles": { col: "xs-5.5", type: "text", label: "Nivel de ingles", defaultValue: this.state?.data?.nivel_ingles },
                        "papeles": { col: "xs-5.5", type: "checkBox", label: "Requiere solo con papeles?", defaultValue: this.state?.data?.papeles },
                        "observacion": {
                            col: "xs-12", type: "textArea", height: 400, label: "Informacion y requerimientos del cliente", defaultValue: this.state?.data?.observacion,
                            placeholder: `
En este espacio, podrás encontrar todos los requerimientos que el cliente ha solicitado para el proyecto. 📝 Es importante que revises cada detalle cuidadosamente, ya que aquí se plasman todas las necesidades y expectativas que debemos cumplir para garantizar un resultado óptimo. 🎯

Recuerda que cualquier modificación o actualización será comunicada a través de este mismo apartado, para que siempre estemos alineados con lo que el cliente espera. 🛠️

👉 Por favor, mantén este espacio siempre actualizado y asegúrate de verificar los requerimientos antes de iniciar cualquier tarea.

¡Gracias por tu colaboración! 😊
                            `
                        },
                        // "Apellidos": { col: "xs-5.8", label: "Apellidos" },
                        // "CI": { col: "xs-5.8", label: "Numero de identidad", placeholder: "_ _ _ _ _ _ _" },
                        // "Correo": { col: "xs-9.5", type: "email", label: "Correo", placeholder: "correo@example.com" },
                        // "Telefono": { col: "xs-5.8", type: "telefono", label: "Telefono", defaultValue: "+1 " },
                    }} onSubmit={(val) => {

                        if (this.pk) {
                            SSocket.sendPromise({
                                component: "cliente",
                                type: "editar",
                                estado: "cargando",
                                data: {
                                    ...this.state.data,
                                    ...val,
                                    papeles: !val.papeles?"":"true"
                                },
                                key_usuario: Model.usuario.Action.getKey(),
                            }).then(e => {
                                Model.cliente.Action._dispatch(e);
                                // SNavigation.goBack();
                                SNavigation.replace("/cliente/profile", { pk: e?.data?.key })
                                console.log(e);
                            }).catch(e => {
                                console.log(e);
                            })
                        } else {
                            if (this.key_company) {
                                val.key_company = this.key_company;
                            }
                            SSocket.sendPromise({
                                component: "cliente",
                                type: "registro",
                                estado: "cargando",
                                data: {
                                    ...val
                                },
                                key_usuario: Model.usuario.Action.getKey(),
                            }).then(e => {
                                Model.cliente.Action._dispatch(e);
                                // SNavigation.goBack();
                                SNavigation.replace("/cliente/profile", { pk: e?.data?.key })
                                console.log(e);
                            }).catch(e => {
                                console.log(e);
                            })
                        }

                    }}
                    onSubmitName={"GUARDAR"}
                />
            </Container>
        </SPage>;
    }
}