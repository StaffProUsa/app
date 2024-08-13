import React from 'react';
import { connect } from 'react-redux';
// import SkeletonContent from 'react-native-skeleton-content';

import { SHr, SNavigation, SPage, SText, SView } from 'servisofts-component';
import LoginGoogle from '../LoginApis/LoginGoogle';
import { Container } from '../Components';
import SSocket from 'servisofts-socket';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <SPage hidden disableScroll>
        <Container>
          <SHr />
          <SText>{JSON.stringify(this.state.usr)}</SText>
          <SHr />
          <LoginGoogle onLogin={(usr) => {
            this.setState({ usr: usr })
            console.log(usr)
          }}>
            <SText padding={8} card>Google</SText>
          </LoginGoogle>

          <SText onPress={() => {
            SSocket.sendPromise({
              service: "roles_permisos",
              component: "rol",
              type: "registros_por_rol",
            }).then(e => {
              console.log(e)
            }).catch(e => {
              console.log(e)
            })
          }} >{"PROBAR ROLES"}</SText>
          
        </Container>
      </SPage>
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Test);
