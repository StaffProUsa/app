import React from 'react';
import {SHr, SPage, SText, SView} from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';

export default class Reservas extends React.Component {
  render() {
    return (
      <>
        <SPage title={'Pedidos de Hoy'} hidden>
          <SView col={'xs-12'} center>
            <SHr height={25} />
            <SText>RESERVAS</SText>
          </SView>
        </SPage>

        <SHr height={20} />
        <PBarraFooter url={'reservas'} />
      </>
    );
  }
}
