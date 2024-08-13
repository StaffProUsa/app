import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SForm, SPage} from 'servisofts-component';
import Parent from '../index';
class TipoUsuario extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getForm() {
    return (
      <SForm
        ref={(ref) => {
          this.form = ref;
        }}
        props={{
          col: 'xs-12'
        }}
        // inputProps={{
        //     customStyle: "Calistenia",
        //     separation: 16,
        // }}
        inputs={{
          usuario: {
            placeholder: 'E-mail',
            isRequired: true,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            type: 'email',
            autoFocus: true,
            onKeyPress: (evt) => {
              if (evt.key === 'Enter') {
                this.form.focus('password');
              }
            }
          },
          password: {
            placeholder: 'Contraseña',
            type: 'password',
            isRequired: true,
            onKeyPress: (evt) => {
              if (evt.key === 'Enter') {
                this.form.submit();
              }
            }
          }
        }}
        onSubmit={(data) => {
          if (data) {
            // Parent.Actions.getAll(data, this.props);
            // Parent.Actions.login(data, this.props);
          }
        }}
      />
    );
  }

  render() {
    return <SPage title={'Tipo de Usuario ' + Parent.component} center></SPage>;
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(TipoUsuario);
