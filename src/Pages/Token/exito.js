import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SGradient, SHr, SIcon, SPage, SText, STheme, SView } from 'servisofts-component';
import PBarraFooter from '../../Components/PBarraFooter';
import { Container } from '../../Components';
import Degradado from '../../Components/Degradado';

export default class exito extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return <SPage center title={''} disableScroll footer={<PBarraFooter url={'/'} />}>
            <SView col={'xs-12'} center>
                <Container>
                    <SView col={'xs-12'} center
                        style={{
                            padding: 20,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: STheme.color.lightGray,
                            overflow: 'hidden',
                        }}>
                        {/* <SGradient colors={["#0C0C10", "#040405"]} style={{ borderRadius: 16, }} />  */}
                        <Degradado />
                        <SHr height={25} />
                        <SText fontSize={28} center language={{
                            es: "¡Inicio de asistencia exitosa!",
                            en: "Successful start of assistance!"
                        }} />
                        <SHr height={35} />
                        <SView width={140} height={140} center style={{
                            borderRadius: 130,
                            backgroundColor: STheme.color.white,
                            overflow: 'hidden',
                            borderWidth: 6,
                            borderColor: STheme.color.success,
                        }}>
                            <SIcon name={'ok'} fill={STheme.color.success} height={80} />
                        </SView>
                        <SHr height={35} />
                        <SView col={"xs-12"}  center>
                            <SText fontSize={20} center language={{
                                es: "Te deseamos muchos éxitos en tu jornada laboral",
                                en: "We wish you every success in your working day"
                            }} />
                            <SView row  >
                                <SHr height={10} />
                                <SIcon name={'aplausos'} fill={STheme.color.text} height={22} width={22} />
                                <SIcon name={'aplausos'} fill={STheme.color.text} height={22} width={22} />
                                <SIcon name={'aplausos'} fill={STheme.color.text} height={22} width={22} />

                            </SView>
                        </SView>
                        <SHr height={25} />
                    </SView>
                </Container>
                <SHr height={75} />
            </SView>
        </SPage>
    }
}
