
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SForm, SHr, SImage, SNotification, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table';
import Config from '../../../Config';
import PButtom from '../../../Components/PButtom';

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
        return <SView col={"xs-12"}  center>
            <SHr height={20} />

            <SText fontSize={16} bold center language={{
                en: "Change salary",
                es: "Cambiar sueldo"
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
                    salary: {
                        placeholder: "Salary", type: "double", isRequired: true,
                    },
                }}

                onSubmit={(values) => {
                    // Model.usuario.Action.recuperarPass({ correo: (values.correo + "").toLowerCase() }).then(resp => {
                    //     SNavigation.navigate("/login/recuperar_codigo");
                    // }).catch(e => {
                    //     console.error(e);
                    // })
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