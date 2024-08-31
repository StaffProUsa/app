import React from 'react';
import { connect } from 'react-redux';
// import SkeletonContent from 'react-native-skeleton-content';

import { SDate, SHr, SInput, SLanguage, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import LoginGoogle from '../LoginApis/LoginGoogle';
import { Container } from '../Components';
import SSocket from 'servisofts-socket';
import Model from '../Model';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <SPage titleLanguage={{ es: "Titulo", en: "Title" }} >
        <Container>
          <SText onPress={() => {
            SSocket.sendPromise({
              component: "asistencia",
              type: "registro",
              data: {
                descripcion: "ASITENCIA TEST",
                key_usuario: Model.usuario.Action.getKey(),
                fecha: new SDate().addSecond(60).toString()
              },
              key_usuario: Model.usuario.Action.getKey(),

            }).then(e => {
              this.setState({ data: e.data })
            })
          }}>{"GENERAR"}</SText>
          <SHr h={20} />
          <SText>{JSON.stringify(this.state, "\n", "\t")}</SText>
          <SHr h={20} />
          <SInput
            ref={ref => this.input = ref}
            label={"CODIGO"}
            placeholder={"_ _ _ _ _ _"} iconR={
              <SView width={60} center card height onPress={() => {
                const code = this.input.getValue();
                SSocket.sendPromise({
                  component: "asistencia",
                  type: "asistir",
                  codigo: code,
                  key_usuario: Model.usuario.Action.getKey(),
                }).then(e => {
                  console.log(e);
                }).catch(e => {
                  console.error(e);
                })
              }}><SText>SUBIR</SText></SView>} />

        </Container>
      </SPage>
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Test);
