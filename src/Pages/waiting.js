import React from 'react';
import { SGradient, SHr, SIcon, SPage, SText, STheme, SView, SLanguage } from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';
import { Container } from '../Components';
import PButtom from '../Components/PButtom';

export default class waiting extends React.Component {
  render() {
    return (
      <>
        <SPage center title={'Waiting'} footer={<PBarraFooter url={'/trabajos'} />}>
          <SView col={'xs-12'} center>
            <Container>
              <SView col={'xs-12'} center >

                <SText fontSize={28} center>Esperando</SText>
                <SHr height={35} />
                <SView col={'xs-12'} center style={{
                  borderWidth: 1,
                  borderColor: STheme.color.warning,
                  borderRadius: 16,
                  padding: 15
                }} row>
                  <SIcon name={'exclamacion'} width={58} height={52} />
                  <SView width={15} />
                  <SText fontSize={20} center language={{
                    es: "Esperando confirmación",
                    en: "Awaiting confirmation"
                  }} />
                </SView>
                <SHr height={45} />
                <SView col={"xs-11"} row center>
                  <PButtom secondary onPress={() => {
                    
                  }}>
                    <SText secondary color={STheme.color.text} language={{
                      es: "CANCELAR TRABAJO",
                      en: "CANCEL WORK"
                    }} />
                  </PButtom>
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
