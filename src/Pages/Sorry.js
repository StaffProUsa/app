import React from 'react';
import { SGradient, SHr, SIcon, SPage, SText, STheme, SView } from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';
import { Container } from '../Components';

export default class Sorry extends React.Component {
  render() {
    return (
      <>
        <SPage center title={'Sorry'} hidden footer={<PBarraFooter url={'/'} />}>
          <SView col={'xs-12'} center>
            <Container>
              <SView col={'xs-12'} center
                style={{
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: STheme.color.darkGray,
                  overflow: 'hidden',
                }}>
                <SGradient colors={["#0C0C10", "#040405"]} style={{ borderRadius: 16, }} />
                <SHr height={25} />
                <SText fontSize={28} center language={{
                    es: "Lo sentimos, no tienes eventos asignados",
                    en: "Sorry, you have no events assigned"
                  }}/>
                <SHr height={35} />
                <SView width={140} height={140} center style={{
                  borderRadius: 130,
                  backgroundColor: STheme.color.white,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: STheme.color.primary,
                }}>
                  <SIcon name={'noevent'} fill={STheme.color.primary} height={80} />
                </SView>
                <SHr height={35} />
                <SText fontSize={20} center language={{
                    es: "No podemos mostrar más información porque no ha recibido invitación para trabajar en ningún evento.",
                    en: "We cannot show more information because he has not received an invitation to work in any event."
                  }}/>
                <SHr height={25} />
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
