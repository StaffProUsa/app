import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup, SInput, SHr, SView, SText, STheme, SButtom, SDate, SLoad } from 'servisofts-component';
import Model from '../../../Model';
import PButtom from '../../../Components/PButtom';
import Btn from '../../../Components/Btn'


class index extends DPA.edit {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "fecha_on", "key_usuario", "key_servicio", "estado", "notification"],
            params: ["pk"],
        });


        this.state = {
            loading: false,
        }
    }

    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" })
    }

    $getData() {
        var data = Parent.model.Action.getByKey(this.$params.pk);
        return data;
    }

    $inputs() {
        var inp = super.$inputs();
        inp["fecha_send"].type = "date"
        inp["fecha_send"].defaultValue = new SDate(inp["fecha_send"].defaultValue, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd")
        return inp;
    }

    $submitName() {
        return null
    }

    $onSubmit(data) {
        this.setState({ loading: true });

        if (this.ihour.getValue().length != 5) {
            SPopup.alert("Formato de la hora no valida, debe ser HH:MM");
            this.setState({ loading: false });
            return;
        }

        data.fecha_send = `${data.fecha_send}T${this.ihour.getValue()}:00.000Z`;


        data.notification = {
            service: "notification",
            componet: "notification",
            type: "sendV2",
            key_usuario_emisor: Model.usuario.Action.getKey(),
            data: {
                descripcion: this.iTitule.getValue(),
                observacion: this.iBody.getValue(),
                data: {
                    deeplink: this.iDeeplink.getValue(),
                },
            },
            tags: {
                key_usuario: this.state.key_usuario,
            }
        }

        // if (!this.appSelect.getValue()) {
        //     SPopup.confirm({
        //         title: "No se selecciono App",
        //         message: "si no se selecciona app se enviara a todas las apps. ¿Desea continuar?",
        //         onPress: (res) => {
        //             data.notification.tags.app = this.appSelect.getValue();
        //             Parent.model.Action.registro({
        //                 data: data,
        //                 key_usuario: Model.usuario.Action.getKey()
        //             }).then((resp) => {
        //                 SNavigation.goBack();
        //             }).catch(e => {
        //                 SPopup.alert("Error: " + e.error)
        //                 console.error(e);
        //                 this.setState({ loading: false });
        //             })
        //         }
        //     })
        //     this.setState({ loading: false });
        //     return;
        // }

        if (this.appSelect.getValue) {
            data.notification.tags.app = this.appSelect.getValue();
        }

        Parent.model.Action.editar({
            data: {
                ...this.data,
                ...data
            },
            key_usuario: Model.usuario.Action.getKey()
        }).then((resp) => {
            SNavigation.goBack();
        }).catch(e => {
            SPopup.alert("Error: " + e.error)
            console.error(e);
            this.setState({ loading: false });
        })
    }

    $footer() {
        if (!this.data) return <SLoad />

        if (!this.state.key_usuario) {
            this.state.key_usuario = this.data?.notification?.tags?.key_usuario;
        }

        let usuario_seleccionado = Model.usuario.Action.getByKey(this.state.key_usuario);
        return <SView col={"xs-12"} center>
            <SInput flex
                type='hour'
                required={true}
                ref={ref => this.ihour = ref}
                style={{
                    padding: 5
                }}
                defaultValue={new SDate(this.data?.fecha_send, "yyyy-MM-ddThh:mm:ss").toString("hh:mm")}
            />

            <SInput
                ref={ref => this.iTitule = ref}
                label={"Titulo"}
                required={true}
                defaultValue={this.data?.notification?.data?.descripcion}
            />

            <SInput
                ref={ref => this.iBody = ref}
                label={"Body"}
                type={"textArea"}
                required={true}
                defaultValue={this.data?.notification?.data?.observacion}
            />

            <SInput
                ref={ref => this.iDeeplink = ref}
                label={"deeplink"}
                required={true}
                defaultValue={this.data?.notification?.data?.data?.deeplink}
            />

            <SInput
                ref={ref => this.appSelect = ref}
                label={"Enviar a App:"}
                type={"select"}
                options={[
                    { key: "", content: "Seleccionar" },
                    { key: "client", content: "Tapeke" },
                    { key: "partner", content: "Partner" },
                    { key: "driver", content: "Driver" },
                    { key: "admin", content: "Admin" },
                ]}
                defaultValue={this.data?.notification?.tags?.app || ""}
            />

            <SHr h={50} />
            <SView col={"xs-12"} height={50} center>
                <Btn col={"xs-12"} loading={this.state.loading} onPress={() => {
                    SNavigation.navigate("/usuario/list", {
                        onSelect: (e) => {
                            this.setState({ key_usuario: e.key });
                        }
                    })
                }}>{usuario_seleccionado ? `usuario seleccionado ${usuario_seleccionado.Nombres} ${usuario_seleccionado.Apellidos}` : "Elegir Usuario"}</Btn>
                {
                    this.state.key_usuario ?
                        <SView col={"xs-12"} center row>
                            <SText fontSize={12} color={STheme.color.danger}>Solo se notificara a un usuario si se selecciona una opción</SText>
                            <SButtom styleText={{ fontSize: 15 }} onPress={() => this.setState({ key_usuario: null })}>Quitar</SButtom>
                        </SView>
                        : null
                }
            </SView>
            <SHr h={40} />



            <PButtom
                secondary={true}
                loading={this.state.loading}
                small
                onPress={() => {
                    let isValid = true;

                    if (!this.ihour.verify()) {
                        isValid = false;
                    }

                    if (!this.iTitule.verify()) {
                        isValid = false;
                    }

                    if (!this.iBody.verify()) {
                        isValid = false;
                    }

                    // if (!this.iDeeplink.verify()) {
                    //     isValid = false;
                    // }

                    if (!isValid) {
                        return;
                    }

                    this.form.submit()
                }}
            >
                Editar Notification Task
            </PButtom>
            <SHr h={40} />
            <PButtom
                danger={true}
                loading={this.state.loading}
                small
                onPress={() => {
                    SPopup.confirm({
                        title: "¿Seguro que quieres eliminar la notificacion?",
                        onPress: (res) => {
                            this.setState({ loading: true });
                            this.data.estado = 0;

                            Parent.model.Action.editar({
                                data: this.data,
                                key_usuario: ""
                            }).then((resp) => {
                                SNavigation.goBack();
                            }).catch(e => {
                                SPopup.alert("Error: " + e.error)
                                console.error(e);
                                this.setState({ loading: false });
                            })
                        }
                    })
                }}
            >
                Eliminar Notification Task
            </PButtom>
        </SView>
    }
}

export default connect(index);