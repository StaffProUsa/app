import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SImage, SLoad, SNavigation, SText, SView} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Parent from '../index';
class Lista extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getContent() {
    var key_usuario = this.props.state.usuarioReducer.usuarioLog.key;
    var data = Parent.Actions.getAll(key_usuario, this.props);
    if (!data) return <SLoad />;
    return Object.keys(data).map((key) => {
      var obj = data[key];
      return (
        <SView
          width={130}
          height={130}
          style={{
            padding: 12
          }}>
          <SView
            col={'xs-12'}
            height
            center
            style={{
              overflow: 'hidden'
            }}
            onPress={() => {
              SNavigation.navigate(obj.url);
            }}>
            <SView flex col={'xs-12'}>
              <SImage src={`${SSocket.api.roles_permisos}page/${obj.key}`} />
            </SView>
            <SView col={'xs-12'} height={34} center>
              <SText center>{obj.descripcion}</SText>
            </SView>
          </SView>
        </SView>
      );
    });
  }

  render() {
    return (
      // <SPage title={'Inicio'} preventBack center hidden>
      <SView col={'xs-12 sm-10 md-8 lg-6 xl-4'} row center>
        {this.getContent()}
      </SView>
      // </SPage>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Lista);
