import React from "react";
import { SDate, SHr, SIcon, SImage, SLoad, SMapView, SMath, SNavigation, SPage, SText, STheme, SView } from "servisofts-component";
import { Container } from "../Components";
import SSocket from "servisofts-socket";
import { component } from "../Services/Usuario/Components/datoCabecera";
import Mapa from "./Evento/Components/Mapa";
import MarcarPorCodigoEvento from "../Components/Asistencia/MarcarPorCodigoEvento";
import CardEventoSteps from "../Components/Evento/CardEventoSteps";
import PBarraFooter from "../Components/PBarraFooter";
import Model from "../Model";


const fontz = 16

export default class cd extends React.Component {

    key_staff_usuario = SNavigation.getParam("key_staff_usuario")
    state = {

    }

    componentDidMount() {
        console.log("CD", "entro al componentDidMount")
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getEventoPerfil",
            key: this.key_staff_usuario,

        }).then(e => {


            if (e.data.key_usuario_atiende == null) {
                this.setState({ data: e.data })


            } else {
                this.getUsuario(e.data.key_usuario_atiende).then((data) => {
                    e.data.usuario_atiende = data;
                    this.setState({ data: e.data })

                })
                //validar si es jefe o no
                SSocket.sendPromise({
                    component: "staff",
                    type: "getPerfilBoss",
                    key_staff: e.data.staff.key,
                    key_boss: e.data
                    // key_boss: Model.usuario.Action.getKey()
                }).then(res => {

                    this.setState({
                        dataBoss: res.data
                    })
                    console.log("dataBoss", res.data)
                    // this.state.data = res.data
                    // this.forceUpdate();
                }).catch(err => {

                })
            }


            // let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))


        })
    }

    getUsuario = async (key_usuario) => {
        const request = {
            version: "2.0",
            service: "usuario",
            component: "usuario",
            type: "getAllKeys",
            keys: [key_usuario],
        }
        const response = await SSocket.sendPromise(request)
        const data = Object.values(response.data).map((a) => a.usuario);
        return data[0];

    }

    getEstado() {
        if (!this.state.data) return null;
        const data = this.state.data;
        const fecha_inicio = new SDate(data.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
        const fecha_fin = new SDate(data.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD");
        const curdate = new SDate();

        if (data.fecha_salida) {
            const fecha_ingreso = new SDate(data.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD");
            const fecha_salida = new SDate(data.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD");
            const since = fecha_ingreso.timeSince(fecha_salida);
            return < ItemEstado fontSize={fontz} language={{
                es: "Asististe al evento " + since,
                en: "You attended the event " + since,
            }} tipo={4} color={STheme.color.success} />
        }
        if (data.fecha_ingreso) {
            const fecha_ingreso = new SDate(data.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD");
            const since = fecha_ingreso.timeSince(curdate);
            return < ItemEstado fontSize={fontz} language={{
                es: "Estas trabajando hace " + since,
                en: "You are working " + since,
            }} tipo={2} color={STheme.color.success} />
        }


        if (curdate.getTime() < fecha_inicio.getTime()) {
            const since = curdate.timeSince(fecha_inicio);
            return < ItemEstado fontSize={fontz} language={{
                es: "Faltan " + since,
                en: "Missing " + since
            }} color={STheme.color.lightGray} />
        }

        if (curdate.getTime() > fecha_fin.getTime()) {
            const since = fecha_inicio.timeSince(curdate);
            return < ItemEstado fontSize={fontz} language={{
                es: "No asististe al evento",
                en: "You did not attend the event",
            }} color={STheme.color.danger} />
        }

        if (curdate.getTime() >= fecha_inicio.getTime()) {
            const since = fecha_inicio.timeSince(curdate);
            return < ItemEstado fontSize={fontz} language={{
                es: "Retrasado por " + since,
                en: "Delayed by " + since,
            }} color={STheme.color.warning} />
        }


        return < ItemEstado fontSize={fontz} language={{
            es: "NO DEBERIA ENTRAR ACA",
            en: "SHOULD NOT ENTER HERE",
        }} />

    }

    isVisibleMarcacion() {
        if (!this.state.data) return null;
        const data = this.state.data;
        const fecha_inicio = new SDate(data.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
        const fecha_fin = new SDate(data.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD");
        const curdate = new SDate();
        if (data.fecha_salida) {
            const fecha_ingreso = new SDate(data.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD");
            const fecha_salida = new SDate(data.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD");
            return false
        }
        if (data.fecha_ingreso) {
            const fecha_ingreso = new SDate(data.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD");
            return true
        }

        if (curdate.getTime() < fecha_inicio.getTime()) {
            return true
        }
        if (curdate.getTime() > fecha_fin.getTime()) {
            return false
        }

        if (curdate.getTime() >= fecha_inicio.getTime()) {
            return true
        }


        return false

    }

    diferenciaEs24Horas(fecha_inicio, fecha_fin) {
        const inicio = new Date(fecha_inicio);
        const fin = new Date(fecha_fin);

        const diffMs = fin.getTime() - inicio.getTime();
        const horas = diffMs / (1000 * 60 * 60);

        return horas === 24;
    }

    render() {


        const fechaIngreso = new Date(this.state?.data?.fecha_ingreso);
        const fechaSalida = new Date(this.state?.data?.fecha_salida);

        let horasTrabajadas = 0;

        if (fechaIngreso && fechaSalida && !isNaN(fechaIngreso) && !isNaN(fechaSalida)) {
            const diferenciaMs = fechaSalida - fechaIngreso;
            horasTrabajadas = (diferenciaMs / (1000 * 60 * 60)).toFixed(2); // redondea a 2 decimales
        }

        let ganancia = horasTrabajadas * (this.state?.data?.salario_hora ?? 0);
        console.log("PINTO DATA", this.state.data)
        return <SPage
            footer={<PBarraFooter url={'/'} />}
        >
            <SHr h={24} />
            <Container loading={!this?.state?.data}>

                <SView style={{
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center"
                }} >
                    <SView flex>
                        <SText style={{
                            flex: 1,
                            fontSize: fontz * 1.4,
                            textAlign: "left"

                        }}>{this.state?.data?.evento?.descripcion}</SText>
                        <SHr />
                        <SView row col={"xs-12"} style={{
                        }}>
                            <SText fontSize={fontz} color={STheme.color.lightGray} language={{
                                en: new SDate(this.state?.data?.evento?.fecha, "yyyy-MM-dd").toString("MONTH dd, yyyy"),
                                es: new SDate(this.state?.data?.evento?.fecha, "yyyy-MM-dd").toString("dd de MONTH del yyyy")
                            }} />
                            <SText fontSize={fontz} color={STheme.color.lightGray} language={{
                                es: " desde las ",
                                en: " from ",

                            }} />
                            <SText fontSize={fontz} color={STheme.color.text} language={{
                                en: new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"),
                                es: new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                            }} />
                            <SText fontSize={fontz} color={STheme.color.lightGray} language={{
                                es: " hasta las ",
                                en: " to ",
                            }} />
                            <SText fontSize={fontz} color={STheme.color.text} language={{
                                en: this.diferenciaEs24Horas(this.state?.data?.staff?.fecha_inicio, this.state?.data?.staff?.fecha_fin) ? "---" : new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"),
                                es: this.diferenciaEs24Horas(this.state?.data?.staff?.fecha_inicio, this.state?.data?.staff?.fecha_fin) ? "---" : new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                            }} />
                        </SView>
                    </SView>
                    <SView style={{
                        width: 80,
                        height: 80,
                        borderRadius: 100,
                        overflow: 'hidden',
                        backgroundColor: STheme.color.card
                    }} >
                        <SImage style={{
                            resizeMode: "cover",
                        }} src={SSocket.api.root + "cliente/" + this.state?.data?.cliente?.key} />
                    </SView>
                </SView>

            </Container>
            <SHr h={16} />
            <SView style={{
                backgroundColor: STheme.color.secondary,
                height: 55,
            }}>
                <Container flex center>
                    {/* <SText bold color={STheme.color.white} style={{
                        fontSize: fontz * 1.5,

                    }}
                        language={{
                            es: "Bienvenido a un nuevo evento",
                            en: "Welcome to a new event",

                        }}
                    /> */}
                    <CardEventoSteps colorPrimary={STheme.color.secondary} colorSecondary={STheme.color.white} data={{
                        staff_usuario: this.state?.data,
                        staff: this.state?.data?.staff,
                    }} />
                    <SHr />
                </Container>
            </SView>
            <SHr h={30} />
            <Container loading={!this?.state?.data}>
                <SView col="xs-12">
                    <SView row col="xs-12" style={{
                        borderBottomWidth: 1,
                        borderColor: STheme.color.card,
                        paddingBottom: 4
                    }}>
                        <SText bold fontSize={fontz * 1.2} language={
                            {
                                es: "Detalles del evento",
                                en: "Event details",

                            }
                        } />


                        <SView flex />
                        <ItemImage src={SSocket.api.root + "company/" + this.state.data?.company.key} label={this.state.data?.company.descripcion} />
                        <ItemImage src={SSocket.api.root + "cliente/" + this.state.data?.cliente.key} label={this.state.data?.cliente.descripcion} />
                        <ItemImage src={SSocket.api.root + "staff_tipo/" + this.state.data?.staff_tipo.key} label={this.state.data?.staff_tipo.descripcion} />
                    </SView>
                    <SHr h={15} />

                    {this.getEstado()}
                    {/* < ItemEstado
                        fontSize={fontz}
                        label={"Estas retrazado 5 minutos"}
                        tipo={3}
                        />
                        < ItemEstado
                        fontSize={fontz}
                        label={"Vas trabajando 5 horas"}
                        tipo={3}
                        />
                        < ItemEstado
                        fontSize={fontz}
                        label={"Trabajaste 10 horas"}
                        tipo={4}
                        />
                        < ItemEstado
                        fontSize={fontz}
                        label={"No asististe al evento"}
                        tipo={5}
                        /> */}
                    <SHr h={20} />


                    {/* <SText fontSize={fontz} color={STheme.color.lightGray} >{
                        new SDate(this.state?.data?.evento?.fecha, "yyyy-MM-dd").toString("dd de MONTH del yyyy")
                        + " desde las "}
                        <SText fontSize={fontz}>{new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                        {" hasta las "}
                        <SText fontSize={fontz}>{new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                    </SText> */}
                    <SText fontSize={fontz} color={STheme.color.lightGray} >{this.state?.data?.evento?.observacion}</SText>

                    <SHr h={16} />

                    <SView row center col={"xs-12"} style={{
                    }}>
                        {/* Aqui es la segunda FOTO */}
                        <SView width={80} height={80} card style={{
                            overflow: "hidden"
                        }}>
                            <SImage style={{
                                resizeMode: "cover",
                            }} src={SSocket.api.root + "staff_tipo/" + this.state?.data?.staff_tipo?.key} />
                        </SView>
                        <SView flex style={{
                            paddingLeft: 8,
                        }} >
                            <SText fontSize={fontz * 1.18} numberOfLines={1}>{this.state?.data?.staff_tipo?.descripcion}</SText>
                            <SText fontSize={fontz * 0.89} color={STheme.color.lightGray} >{this.state?.data?.staff?.descripcion}</SText>
                        </SView>

                    </SView>
                    <SHr h={20} />
                    <SView row col="xs-12" >
                        <SText width={120} fontSize={fontz} language={{
                            es: "Nivel de ingles:",
                            en: "Level of english:",
                        }}></SText>
                        <SText flex fontSize={fontz}  >{this.state?.data?.staff?.nivel_ingles}</SText>
                    </SView>
                    <SHr h={20} />
                    <SView row col="xs-12">
                        <SText width={120} fontSize={fontz} language={{
                            es: "Dirección:",
                            en: "Address:",

                        }}></SText>
                        <SText flex fontSize={fontz * .95}  >{this.state?.data?.cliente.direccion}</SText>
                    </SView>
                    <SHr h={20} />
                    <SView row col="xs-12">
                        <SText width={120} fontSize={fontz} language={{
                            es: "Requerimientos del cliente:",
                            en: "Customer requirements:",

                        }}></SText>
                        <SText flex fontSize={fontz * .95}  >{this.state?.data?.cliente.observacion}</SText>
                    </SView>
                    <SHr h={30} />

                    <SText fontSize={fontz * 1.5} bold language={{
                        es: "Datos del jefe",
                        en: "Boss data",
                    }}></SText>

                </SView>
                <SHr h={3} />
                <SView row col="xs-12" style={{
                    borderBottomWidth: 1,
                    borderColor: STheme.color.card,
                    paddingBottom: 4
                }}>

                </SView>
                <SHr h={30} />

                {
                    !!this.state?.data?.key_usuario_atiende ?
                        <SView row col="xs-12">
                            <SView style={{
                                width: 80,
                                height: 80,
                                borderRadius: 100,
                                overflow: 'hidden',
                                backgroundColor: STheme.color.card
                            }} >
                                <SImage src={SSocket.api.root + "usuario/" + this.state?.data?.key_usuario_atiende} />
                            </SView>
                            <SView style={{ width: 15 }} />
                            <SView style={{ flex: 1, justifyContent: "center" }}>
                                <SText>
                                    {this.state?.data?.usuario_atiende?.Nombres} {this.state?.data?.usuario_atiende?.Apellidos}
                                </SText>
                                <SHr h={10} />

                                <SView row>
                                    <SText language={{
                                        es: "Telefono:",
                                        en: "Phone:",
                                    }}></SText>
                                    <SView width={10} />
                                    <SText
                                        style={{
                                            color: STheme.color.link,
                                            textDecorationLine: "underline",
                                        }}
                                        onPress={() => {
                                            let telefono = this.state?.data?.usuario_atiende?.Telefono;
                                            let url = "https://api.whatsapp.com/send?phone=" + telefono.replace("+", "") + "&text=Hola, estoy interesado en el evento " + this.state?.data?.evento?.descripcion;
                                            SNavigation.openURL(url);
                                        }}
                                    >
                                        {this.state?.data?.usuario_atiende?.Telefono}
                                    </SText>
                                </SView>

                                <SHr h={10} />
                                {this.isVisibleMarcacion() ?
                                    <SText color={STheme.color.lightGray} language={{
                                        es: "Contacta a tu jefe para consultar el código",
                                        en: "Contact your boss to consult the code",
                                    }}>


                                    </SText> : null
                                }
                            </SView>
                        </SView>
                        :
                        <SView col="xs-12" center style={{
                            padding: 16,
                            backgroundColor: STheme.color.warning + "30", // fondo amarillo suave
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: STheme.color.warning,
                            marginTop: 8,
                        }}>
                            <SView row center>
                                <SView style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 12,
                                    backgroundColor: STheme.color.warning,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 8,
                                }}>
                                    <SText color={STheme.color.white} fontSize={16}>!</SText>
                                </SView>
                                <SText col={"xs-9"} bold color={STheme.color.warning} fontSize={16} language={{
                                    es: "No tienes jefe asignado para este evento",
                                    en: "You do not have a boss assigned for this event",
                                }} />

                            </SView>
                        </SView>
                }
                <SHr h={30} />

                {/* <SHr h={15} />
                <SView row col="xs-12">
                    <SView col="xs-6" style={{


                    }}>
                        <SText >Evento:</SText>
                        <SHr h={16} />
                        <SText>*Ubicacion:</SText>
                        <SHr h={16} />
                        <SText>*Fecha: </SText>
                        <SHr h={16} />
                        <SText>*Hora de inicio:</SText>
                        <SHr h={16} />
                        <SText>*Hora fin:</SText>
                    </SView>
                    <SView col="xs-6" >
                        <SText>Otro</SText>
                        <SHr h={16} />
                        <SText>Parque Arenal</SText>
                        <SHr h={16} />
                        <SText>10/04/2025</SText>
                        <SHr h={16} />
                        <SText>{new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                        <SHr h={16} />
                        <SText>{new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                    </SView>
                </SView> */}
                {/* <SHr h={50} /> */}
                {
                    this.isVisibleMarcacion() ?
                        <MarcarPorCodigoEvento
                            dataJefe={(this.state?.data?.key_usuario_atiende === Model.usuario.Action.getKey()) ? true : false}
                            // dataJefe={true}
                            key_evento={this.state?.data?.evento?.key}
                            onChange={() => {
                                this.componentDidMount();
                            }}
                        // dataJefe={this.state?.dataJefe}
                        /> : null
                }
                <SHr h={20} />





                <SView width={12} />

                {!this.isVisibleMarcacion() ?
                    <SView
                        col={"xs-12"}
                        center
                        backgroundColor={STheme.getTheme() == 'dark' ? STheme.color.darkGray : STheme.color.card} // Fondo más oscuro para modo oscuro
                        padding={16}
                        style={{
                            borderRadius: 16,
                            borderWidth: 2,
                            borderColor: STheme.color.black + "35",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                            elevation: 6,
                        }}
                    >
                        {[
                            {
                                label: { es: "Fecha ingreso:", en: "Entry date:" },
                                value: new SDate(this.state?.data?.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD").toString("MM/dd/yyyy hh:mm"),
                                icon: "CalendarCheck",
                                color: STheme.color.lightGray,
                            },
                            {
                                label: { es: "Fecha salida:", en: "Exit date:" },
                                value: new SDate(this.state?.data?.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").toString("MM/dd/yyyy hh:mm"),
                                icon: "CalendarX",
                                color: STheme.color.lightGray,
                            },
                            {
                                label: { es: "Horas trabajadas:", en: "Worked hours:" },
                                value: horasTrabajadas,
                                icon: "Clock",
                                color: STheme.color.success,
                            },
                            {
                                label: { es: "Salario por hora:", en: "Salary per hour:" },
                                value: `$${this.state?.data?.salario_hora ?? 0}`,
                                icon: "DollarSign",
                                color: STheme.color.warning,
                            },
                            {
                                label: { es: "Ganancia:", en: "Earnings:" },
                                value: "$" + SMath.formatMoney(ganancia),
                                icon: "TrendingUp",
                                color: STheme.color.danger,
                            },
                        ].map((item, index) => (
                            <SView
                                key={index}
                                row
                                col={"xs-12"}
                                alignItems="center"
                                justifyContent="space-between"
                                style={{
                                    paddingVertical: 10,
                                    borderBottomWidth: index !== 4 ? 1 : 0,
                                    borderBottomColor: STheme.color.lightBlack,
                                }}
                            >
                                <SView row alignItems="center">
                                    <SIcon name={item.icon} width={18} height={18} fill={item.color} />
                                    <SView width={8} />
                                    <SText fontSize={fontz * 0.85} color={STheme.color.text} language={item.label} />
                                </SView>
                                <SView flex />
                                <SText fontSize={fontz * 0.85} color={item.color}>
                                    {item.value}
                                </SText>
                            </SView>
                        ))}
                    </SView>
                    : null
                }






                <SHr h={12} />

                <SView row col={"xs-12"} style={{



                }}>

                    {/* <HorasTrabajadas data={this.state?.data} color={STheme.color.danger} label={"Ganancia"} number={ganancia} /> */}
                </SView>

                <SHr h={16} />



                <SHr color={STheme.color.card} h={1} />
                <SHr h={15} />
                <SView center row col={"xs-12"}>
                    <SIcon name="iubicacion" fill={STheme.color.text} width={15} height={18} />
                    <SView width={5} />

                    <SText bold style={{
                        fontSize: fontz,
                    }} language={{
                        es: "Ubicación",
                        en: "Location",
                    }}></SText>
                </SView>

                <SHr h={30} />
                <Mapa height={400} data={this.state.data} />

                {/* <SView row col={"xs-12"}>
                    <SView col={"xs-6"}>
                        <SText center border borderRadius={8} style={{
                            fontSize: 20,
                            width: "90%",
                            margin: 5,
                            padding: 2,
                            borderColor: STheme.color.white,
                            backgroundColor: STheme.color.darkGray,

                        }} onPress={Function} numberOfLines={1}> NO, GRACIAS</SText>
                    </SView>

                    <SView col={"xs-6"}>

                        <SText center border borderRadius={8} style={{
                            fontSize: 20,
                            width: "90%",
                            margin: 5,
                            padding: 2,
                            borderColor: STheme.color.white,
                            backgroundColor: STheme.color.secondary,
                        }} onPress={Function} numberOfLines={1}>ACEPTAR</SText>
                    </SView>


                </SView> */}


            </Container>
            <SHr h={30} />
            {/* <SText center color={STheme.color.danger} style={{
                fontSize: fontz
            }} language={{
                es: "ESTA MAL EL BOTON DEL CODIGO DE STAFF, PENDIENTE RICKY",
                en: "THE STAFF CODE BUTTON IS WRONG, PENDING RICKY",

            }}></SText> */}


            <SHr h={80} />

        </SPage >
    }
}






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

const ItemEstado = ({ fontSize, language, color }) => {

    return <SView center style={{
        width: "100%",
        margin: 4,
        padding: 4,
    }}>
        <SText center border clean style={{

            fontSize: fontSize,
            margin: 7,
            padding: 16,
            backgroundColor: color + "44",
            borderColor: color,
            borderWidth: 1,
            //backgroundColor: STheme.color.secondary,
            borderRadius: 8,

        }} language={language} />
    </SView>
}
const HorasTrabajadas = ({ number, height, data, color, label, children }) => {

    if (!data.fecha_salida) return null

    return <SView style={{

        flex: 1,
        height: height ?? 90,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: color,
        overflow: 'hidden',
        backgroundColor: color + "55",
    }

    } center>
        <SText center fontSize={22} bold>{number}</SText>
        <SText center>{label}</SText>
        {children}
    </SView>
}
