import React from 'react';
import { connect } from 'react-redux';
import {
  SIcon,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  STable2,
  STheme,
  SView,
  SImage,
  SDate
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import banner from '..';
import FloatButtom from '../../../../../Components/FloatButtom';
import usuario from '../../../../Usuario/Components/usuario';

class Lista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key = SNavigation.getParam('key');
  }

  getTipo_entradaTabla() {
    var data = banner.Actions.getAll(this.props);
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
          { key: "key", label: "key", width: 140 },
          { key: "observacion", label: "Titulo", width: 220 },
          { key: "descripcion", label: "descripcion", width: 100 , center:true},
          {
            key: 'key-editar',
            label: 'Editar',
            width: 50,
            center: true,
            component: (item) => {
              return (
                <SView
                  onPress={() => {
                    SNavigation.navigate('admin/parametro/registro', {
                      key: item
                    });
                  }}>
                  <SIcon name={'Edit'} width={35} />
                </SView>
              );
            }
          },
          // {
          //   key: 'key-eliminar',
          //   label: 'Eliminar',
          //   width: 60,
          //   center: true,
          //   component: (key) => {
          //     return (
          //       <SView
          //         width={35}
          //         height={35}
          //         onPress={() => {
          //           SPopup.confirm({
          //             title: 'Eliminar',
          //             message: '¿Esta seguro de eliminar?',
          //             onPress: () => {
          //               banner.Actions.eliminar(data[key], this.props);
          //             }
          //           });
          //         }}>
          //         <SIcon name={'Delete'} />
          //       </SView>
          //     );
          //   }
          // }
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

          {/* <FloatButtom
            onPress={() => {
              SNavigation.navigate('admin/banner/registro');
            }}
          /> */}
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Lista);
