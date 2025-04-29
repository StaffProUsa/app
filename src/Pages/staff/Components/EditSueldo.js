
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SForm, SHr, SImage, SLanguage, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table';
import Config from '../../../Config';
import PButtom from '../../../Components/PButtom';
import Model from '../../../Model';
import MDL from '../../../MDL';
import users from '../users';

export default class EditSueldo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    loadData = async () => {
        console.log("ENTRO ACAAAA")
        const resp = await SSocket.sendPromise({
            component: "staff",
            type: "getStaffChange",
            key_staff: this.props.key_staff,
        })
        return resp.data
        // return ["asdsa", "ASdsad", "fgdghe", "$35345"]
    }
    handleChange = ({ key_staff_to }) => {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "cambiarEvento",
            data: this.props.staff_usuario_list,
            key_staff: key_staff_to,
        }).then(e => {
            SNotification.send({
                key: "staff_usuario-asingJefe",
                title: "Successfully applied.",
                body: "Successfully registered.",
                color: STheme.color.success,
                time: 5000,
            })
            if (this.props.onChange) {
                this.props.onChange()
            }
        }).catch(e => {
            console.error(e)

        })
    }
    render() {
        return <SView col={"xs-12"} center>
            <SHr height={20} />

            <SText fontSize={16} bold center language={{
                en: "Change salary",
                es: "Cambiar salario"
            }} />
            <SHr height={20} />
            <SForm
                ref={(ref) => { this.form = ref; }}
                row
                style={{
                    justifyContent: "space-between",
                }}
                inputProps={{
                    col: "xs-12",
                }}
                inputs={{
                    salario_hora: {
                        placeholder: "Salary", type: "double", isRequired: true, defaultValue: this.props.data.salario_hora,
                    },
                }}

                onSubmit={(values) => {
                    SSocket.sendPromise({
                        component: "staff_usuario",
                        type: "editar",
                        key_usuario: this.props.data.key_usuario,
                        data: {
                            ...this.props.data,
                            salario_hora: values.salario_hora,
                        }
                    }).then((resp) => {
                        SNotification.send({
                            key: "staff-EditSueldo",
                            title: SLanguage.select({
                                en: "Successfully applied",
                                es: "Se aplicó correctamente"
                            }),
                            body: SLanguage.select({
                                es: "Edición exitosa.",
                                en: "Edit successfully."
                            }),
                            color: STheme.color.success,
                            time: 5000,
                        })

                        users.INSTANCE.componentDidMount();
                        SPopup.close("EditSueldo")
                    }
                    ).catch((e) => {
                        console.error(e)
                        SNotification.send({
                            key: "staff-EditSueldo-error",
                            title: "Error",
                            body: SLanguage.select({
                                es: "Error al editar.",
                                en: "Error editing."

                            }),
                            color: STheme.color.danger,
                            time: 5000,
                        })
                    })
                }}
            />
            <SHr height={20} />
            <SView col={"xs-12"} row center>
                <PButtom rojo onPress={() => {
                    this.form.submit();
                }}><SText color={STheme.color.white} language={{
                    es: "GUARDAR",
                    en: "SAVE"
                }} /></PButtom>
            </SView>
        </SView >
    }
}