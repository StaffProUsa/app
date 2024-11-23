import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SInput, SNavigation, SNotification, SPage, SText, STheme, SThread, SView, SLanguage, SImage, SLoad } from 'servisofts-component';
import PBarraFooter from '../Components/PBarraFooter';
import { Container } from '../Components';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import PButtom from '../Components/PButtom';
import Trabajos from '../Components/Trabajos';

export default class event_in_progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondDuration: 60
    };
  }


  render() {
    return <SPage titleLanguage={{ es: "Asistencia", en: "Assistance" }} footer={<PBarraFooter url={'/token'} />}>
      <Container>
        <SHr h={20} />
        <Trabajos />
      </Container>
    </SPage>
  }
}
