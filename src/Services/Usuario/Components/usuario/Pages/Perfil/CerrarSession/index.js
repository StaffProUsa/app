import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SButtom, SPopup} from 'servisofts-component';
import Usuario from '../../..';

class CerrarSession extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SButtom
        secondary
        onPress={() => {
          SPopup.confirm({
            title: 'Cerrar sesión',
            message: 'Seguro que desea desconectar su usuario?',
            onPress: () => {
              Usuario.Actions.logout(this.props);
            }
          });
        }}>
        CERRAR SESIÓN
      </SButtom>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(CerrarSession);
