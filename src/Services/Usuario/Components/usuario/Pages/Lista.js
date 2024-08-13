import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  SIcon,
  SImage,
  SLoad,
  SNavigation,
  SPage,
  STable2,
  STheme,
  SView
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Parent from '../index';
class Lista extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getContent() {
    var data = Parent.Actions.getAll(this.props);
    if (!data) return <SLoad />;
    return (
      <STable2
        headerColor={STheme.color.info}
        header={[
          {key: 'index', label: '#', width: 50},
          {
            key: 'key-foto',
            label: 'Foto',
            width: 70,
            center: true,
            component: (key) => {
              return (
                <SView width={40} height={40} onPress={() => {}}>
                  <SImage
                    src={SSocket.api.root + Parent.component + '/' + key}
                  />
                </SView>
              );
            }
          },
          // {key: 'CI', label: 'CI', width: 150},
          {key: 'Nombres', label: 'Nombres', width: 150},
          {key: 'Apellidos', label: 'Apellidos', width: 150},
          {key: 'Correo', label: 'Correo', width: 150},
          // {
          //   key: 'Fecha de nacimiento',
          //   label: 'Fecha de nacimiento',
          //   width: 150
          // },
          {key: 'Telefono', label: 'Telefono', width: 150},
          // { key: "Password", label: "Password", width: 150 },
          {
            key: 'key-editar',
            label: 'Editar',
            width: 50,
            center: true,
            component: (item) => {
              return (
                <SView
                  onPress={() => {
                    SNavigation.navigate(Parent.component + '/registro', {
                      key: item
                    });
                  }}>
                  <SIcon name={'Edit'} width={35} />
                </SView>
              );
            }
          },
          // {
          //   key: 'key-roles',
          //   label: 'Roles',
          //   width: 50,
          //   center: true,
          //   component: (item) => {
          //     return (
          //       <SView
          //         onPress={() => {
          //           SNavigation.navigate(Parent.component + '/rol', {
          //             key: item
          //           });
          //         }}>
          //         <SIcon name={'Ajustes'} width={35} />
          //       </SView>
          //     );
          //   }
          // }
        ]}
        data={data}
      />
    );
  }
  render() {
    // Parent.Actions.validateSession(this.props);
    return (
      <SPage title={'Lista de ' + Parent.component} disableScroll center>
        {this.getContent()}
      </SPage>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Lista);
