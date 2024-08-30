import React from 'react';
import { SGradient, SHr, SIcon, SImage, SPage, SText, STheme, SView } from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';
import { Btn, Container } from '../Components';

export default class Invitacion extends React.Component {
  render() {
    return (
      <>
        <SPage title={'Invitación'} hidden  >
          <SView col={'xs-12'} >
            <SHr height={25} />
            <Container>
              <SView col={'xs-12'} row center>
                <SView col={'xs-6'} >
                  <SText fontSize={18} >Hi James Clark!</SText>
                </SView>
                <SView col={'xs-6'} flex style={{ alignItems: "flex-end" }}>
                  <SView height={80} width={80} style={{ borderRadius: 50, }} center   >
                    <SImage enablePreview src={require('../Assets/images/sofia.jpeg')} width={100} height={100} style={{ resizeMode: 'cover', borderRadius: 50 }} />
                  </SView>
                </SView>
              </SView>
              <SHr height={15} />
            </Container>
            <SView col={'xs-12'} center backgroundColor={STheme.color.secondary} padding={15}>
              <SText fontSize={22} color={STheme.color.primary}>We invite you to be part of Sofía!</SText>
            </SView>
            <SHr height={30} />
            <Container>
              <SView col={'xs-11'} >
                <SText fontSize={18} >We need to incorporate people for the position of:</SText>
                <SHr height={25} />
                <SView col={'xs-12'} row center>
                  <SView col={'xs-6'} flex style={{ alignItems: "flex-end" }} >
                    <SView width={80} height={80}>
                      <SImage enablePreview src={require('../Assets/images/actividad.jpg')} width={100} height={100} style={{ resizeMode: 'contain', borderRadius: 10 }} />
                    </SView>
                  </SView>
                  <SView col={'xs-6'} row>
                    <SView width={20} />
                    <SText fontSize={17} >Bartender</SText>
                  </SView>

                </SView>
                <SHr height={25} />
                <SText fontSize={15} color={STheme.color.lightGray} justify >A bartender is a person who works in a bar or drinking establishment and is in charge of preparing and serving all types of drinks.</SText>
                <SHr height={25} />
                <SView col={'xs-12'} row center>
                  <SView col={'xs-6'} row >
                    <SIcon name={'idate'} fill={STheme.color.primary} width={20} height={20} />
                    <SView width={8} />
                    <SText fontSize={20} >Fecha:</SText>
                  </SView>
                  <SView col={'xs-6'} row>
                    <SText fontSize={20} color={STheme.color.lightGray} >10/08/24</SText>
                  </SView>
                  <SHr height={10} />
                  <SView col={'xs-6'} row >
                    <SIcon name={'idate'} fill={STheme.color.primary} width={20} height={20} />
                    <SView width={8} />
                    <SText fontSize={20} >Horario:</SText>
                  </SView>
                  <SView col={'xs-6'} row>
                    <SText fontSize={20} color={STheme.color.lightGray} >08:30 AM - 12:30 PM</SText>
                  </SView>
                </SView>
                <SHr height={55} />
                <SView col={'xs-12'} row center>
                  <Btn col={"xs-4"} onPress={() => {
                    SNavigation.navigate("/registro")
                  }} backgroundColor={STheme.color.darkGray} >I REJECT</Btn>
                  <SView width={25} />
                  <Btn col={"xs-4"} onPress={() => {
                    SNavigation.navigate("/registro")
                  }} backgroundColor={STheme.color.secondary}>I ACCEPT</Btn>
                </SView>
              </SView>
            </Container>
            <SHr height={25} />
          </SView>
        </SPage>

        <SHr height={20} />
        {/* <PBarraFooter url={'reservas'} /> */}
      </>
    );
  }
}
