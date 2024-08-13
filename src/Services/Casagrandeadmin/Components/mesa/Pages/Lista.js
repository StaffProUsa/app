import React from 'react';
import {connect} from 'react-redux';
import {
  SDate,
  SIcon,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  STable2,
  STheme,
  SView
} from 'servisofts-component';
import sector from '..';
import FloatButtom from '../../../../../Components/FloatButtom';
import usuario from '../../../../Usuario/Components/usuario';

class Lista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key = SNavigation.getParam('key');
  }

  getTipo_entradaTabla() {
    var data = sector.Actions.getByKeyEvento(this.key, this.props);
    var data_usuario = usuario.Actions.getAll(this.props);
    if (!data) return <SLoad />;
    if (!data_usuario) return <SLoad />;
    return (
      <STable2
        headerColor={STheme.color.info}
        header={[
          {
            key: 'index',
            label: '#',
            width: 50,
            color: STheme.color.danger,
            fontSize: 16,
            font: 'Roboto'
          },
          {key: 'descripcion', label: 'Descripcion', width: 130},
          {key: 'precio', label: 'precio', width: 130,center: true, },
          {key: 'cantidad', label: 'Cantidad disponibles', width: 130,center: true, },
          {
            key: 'key_usuario',
            label: 'Usuario creador',
            width: 130,
            center: true,
            render: (key_usuario) => {
              var obj_usr = data_usuario[key_usuario];
              if (!obj_usr) return '--';
              return obj_usr['Nombres'] + ' ' + obj_usr['Apellidos'];
            }
          },
          {
            key: 'fecha_on',
            label: 'Fecha creacion',
            width: 90,
            center: true,
            render: (fecha) => {
              return !fecha ? '' : new SDate(fecha).toString('yyyy-MM-dd');
            }
          },
          {
            key: 'key-editar',
            label: 'Editar',
            width: 50,
            center: true,
            component: (item) => {
              return (
                <SView
                  onPress={() => {
                    SNavigation.navigate('admin/sector/registro', {
                      key: item
                    });
                  }}>
                  <SIcon name={'Edit'} width={35} />
                </SView>
              );
            }
          },
          {
            key: 'key-eliminar',
            label: 'Eliminar',
            width: 60,
            center: true,
            component: (key) => {
              return (
                <SView
                  width={35}
                  height={35}
                  onPress={() => {
                    SPopup.confirm({
                      title: 'Eliminar',
                      message: '¿Esta seguro de eliminar?',
                      onPress: () => {
                        sector.Actions.eliminar(data[key], this.props);
                      }
                    });
                  }}>
                  <SIcon name={'Delete'} />
                </SView>
              );
            }
          }
        ]}
        data={data}
        filter={(dta) => {
          if (dta.estado != 1) return false;
          return true;
        }}
      />
    );
  }

  render() {
    return (
      <>
        <SPage title={'Lista'} disableScroll>
          <SView col={'xs-12'} center height>
            {this.getTipo_entradaTabla()}
          </SView>

          <FloatButtom
            onPress={() => {
              SNavigation.navigate('admin/sector/registro', {
                key_evento: this.key
              });
            }}
          />
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Lista);
