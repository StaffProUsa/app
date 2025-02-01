import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SLanguage } from 'servisofts-component';
import { AccentBar } from '../../Components';
import Container from '../../Components/Container';
import Model from '../../Model';
// import SectionApis from '../login/components/SectionApis';
// import BtnSend from './components/BtnSend';
// import Header from './components/Header';
// import CryptoJS from 'crypto-js';
// import PButtom from '../../Components/PButtom';
import SSocket from 'servisofts-socket';
import BtnSend from '../registro/components/BtnSend';
import PButtom from '../../Components/PButtom';
import list from './list';
import SRT from '../../SRT';

export default class edit_employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envio: 0
        };
        this.key_employe = SNavigation.getParam("key_employe")
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        SSocket.sendPromise({
            component: "usuario_company",
            type: "getByKey",
            key_usuario: Model.usuario.Action.getKey(),
            key: this.key_employe
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }


    icon = (name) => {
        return <SIcon
            name={name}
            fill={STheme.color.primary}
            width={17}
            height={20}
        />
    }
    render() {
        var defaultData = {
            ...this.params,
        };
        return (
            <SPage titleLanguage={{
                es: "Editar Número de Empleado",
                en: "Edit Employee Number"
            }}>
                <SView col={"xs-12"} center>
                    <SHr height={20} />
                    <Container loading={!this.state.data}>
                        <SView col={"xs-12"} center>
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
                                    employee_number: {
                                        defaultValue: this.state?.data?.employee_number,
                                        placeholder: "", type: "text", isRequired: true, label: SLanguage.select({ es: "# Empleado", en: "# Employee" })
                                    },
                                }}
                                error={this.state.error}

                                onSubmit={(values) => {

                                    SSocket.sendPromise({
                                        component: "usuario_company",
                                        type: "editar",
                                        data: {
                                            key: this.key_employe,
                                            employee_number: values.employee_number
                                        }
                                    }).then(e => {
                                        SRT.notify(e);
                                        SNavigation.goBack();
                                    }).catch(e => {

                                    })

                                    // Model.usuario.Action.verificarCodigoPass({ codigo: values.Codigo }).then(resp => {
                                    //     var usr_rec = resp.data;
                                    //     SNavigation.navigate("/login/recuperar_pass", usr_rec);
                                    // }).catch(e => {
                                    //     console.error(e);
                                    //     if (e?.error == "error_datos") {
                                    //         this.setState({ loading: false, error: mensajeError })
                                    //     } else {
                                    //         this.setState({ loading: false, error: mensajeError2 })
                                    //     }
                                    // })

                                }
                                }
                            />
                            <SHr height={20} />
                            <PButtom
                                rojo
                                props={
                                    {
                                        // type: "outline"
                                    }
                                }
                                onPress={() => {
                                    this.form.submit();
                                }}>
                                {SLanguage.select({
                                    es: "GUARDAR",
                                    en: "SAVE"
                                })}
                            </PButtom>
                        </SView>
                        <SHr height={30} />
                        {/* <SectionApis /> */}
                    </Container>
                </SView>
            </SPage>
        );
    }
}
