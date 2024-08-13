import React from 'react';
import { connect } from 'react-redux';
import {
  SDate,
  SHr,
  SIcon,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  STable2,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import evento from '../../Services/Casagrandeadmin/Components/evento';
// import FloatButtom from '../../../../../Components/FloatButtom';
import usuario from '../../Services/Usuario/Components/usuario';
import SSocket from 'servisofts-socket';
import { Parent } from "."

class Entradas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.key_usuario = SNavigation.getParam("pk");
    this.key_evento = SNavigation.getParam("pk_evento");
  }

  componentDidMount() {

    SSocket.sendPromise({
      component: "evento",
      type: "getAll",
      key_usuario: SNavigation.getParam("pk"),
      // key_evento: SNavigation.getParam("pk_evento"),
    }).then(a => {
      this.setState({ data: a.data })
    })
  }

  $allowAccess() {
    return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver_roles" })
}


  getEventosTabla() {
    if (!this.state.data) return <SLoad />;
    // var data = evento.Actions.getAll(this.props);
    var data = this.state.data;
    var data_usuario = usuario.Actions.getAll(this.props);
    if (!data) return <SLoad />;
    if (!data_usuario) return <SLoad />;

   
    console.log("data", this.state.data)
    console.log("this.key_usuario", this.key_usuario)

    return (
      <STable2
        headerColor={STheme.color.info}
        rowHeight={60}
        header={[
          {
            key: 'index',
            label: '#',
            width: 50,
            color: STheme.color.danger,
            fontSize: 16,
            font: 'Roboto'
          },
          { key: 'fecha', order: "desc", label: 'Fecha evento', width: 110, render: (fecha) => { return !fecha ? "0" : new SDate(fecha).toString("yyyy-MM-dd") } },
          { key: 'descripcion', label: 'Descripción', width: 200 },
          { key: 'observacion', label: 'Observación', width: 200 },
          // { key: 'fecha_on', label: 'fecha_on', width: 130 },

          // {
          //   key: 'key_usuario', label: 'Usuario creador', width: 130, render: (key_usuario) => {
          //     var obj_usr = data_usuario[key_usuario];
          //     if (!obj_usr) return "--"
          //     return obj_usr["Nombres"] + " " + obj_usr["Apellidos"]
          //   }
          // },
          // { key: 'fecha_on', label: 'Fecha creación', width: 90, center: true, render: (fecha) => { return !fecha ? "" : new SDate(fecha).toString("yyyy-MM-dd") } },




          {
            key: 'key-tipo-entrada',
            label: 'T. entrada',
            width: 60,
            center: true,
            component: (key) => {
              return (
                <SView
                  onPress={() => {
                    SNavigation.navigate('admin/tipo_entrada', { key: key });
                  }}>
                  <SIcon name={'TipoEntrada'} width={35} />
                </SView>
              );
            }
          },
          {
            key: 'key-tipo-sector',
            label: 'T. sector',
            width: 60,
            center: true,
            component: (key) => {
              return (
                <SView
                  onPress={() => {
                    SNavigation.navigate('admin/sector', { key: key });
                  }}>
                  <SIcon name={'Sector'} width={35} />
                </SView>
              );
            }
          },

        ]}
        data={data}
        filter={(dta) => {
          if (dta.estado != 1) return false;
          return true;
        }}
      />
    );
  }

  getButtons(key) {
    return <SView flex row margin={10}>


      <SView
        center
        margin={10}
        onPress={() => {
          SNavigation.navigate('admin/actividad', { key: key });
        }}>
        <SIcon name={'Actividad'} fill={'#0077b5'} width={35} />
        <SText>Actividades</SText>
      </SView>

      <SView
        center
        margin={10}
        onPress={() => {
          SNavigation.navigate('admin/tipo_entrada', { key: key });
        }}>
        <SIcon name={'TipoEntrada'} width={35} />
        <SText>Tipos de entradas</SText>
      </SView>

      <SView
        center
        margin={10}
        onPress={() => {
          SNavigation.navigate('admin/sector', { key: key });
        }}>
        <SIcon name={'Sector'} width={35} />
        <SText>Sectores</SText>
      </SView>

      <SView
        center
        margin={10}
        onPress={() => {
          SNavigation.navigate('planimetria', { key_evento: key });
        }}>
        <SIcon name={'Planimetria'} width={35} />
        <SText>Planimetria</SText>
      </SView>
    </SView>
  }

  getEventosLista() {
    var data = evento.Actions.getAll(this.props);
    var data_usuario = usuario.Actions.getAll(this.props);
    if (!data) return <SLoad />;
    if (!data_usuario) return <SLoad />;
    return <SView col={'xs-12'} height>
      {
        Object.values(data).sort((a, b) => { return a.fecha < b.fecha ? 0 : -1 }).map((evento) => {
          return <SView key={evento.key} card padding={10} margin={10}>

            <SView flex row>

              <SView flex row>
                <SView
                  margin={10}
                  onPress={() => {
                    SNavigation.navigate('admin/evento/perfil', { key: evento.key });
                  }}>
                  <SIcon name={'PerfilEvent'} width={35} />
                </SView>
              </SView>

              <SView flex row>

                <SView
                  center
                  margin={10}
                  onPress={() => {
                    SNavigation.navigate('admin/evento/registro', { key: evento.key });
                  }}>
                  <SIcon name={'Edit'} width={35} />
                  <SText>Editar</SText>
                </SView>


                <SView
                  center
                  margin={10}
                  onPress={() => {
                    SPopup.confirm({
                      title: 'Eliminar',
                      message: '¿Esta seguro de eliminar?',
                      onPress: () => {
                        evento.Actions.eliminar(evento.key, this.props);
                      }
                    });
                  }}>
                  <SIcon name={'Delete'} width={35} />
                  <SText>Eliminar</SText>
                </SView>

              </SView>

            </SView>

            <SText>{evento.descripcion}</SText>
            <SHr height={1} margin={10} color='#fff' border={1} />

            {this.getButtons(evento.key)}

            <SHr height={20} />
            <SText fontSize={10} >{evento.fecha}</SText>
          </SView>
        })
      }
    </SView>
  }

  render() {
    return (
      <>
        <SPage title={'Lista'}>
          <SView col={'xs-12'} center height >
            {/*this.getEventosLista()*/}
            {this.getEventosTabla()}
          </SView>
          {/* <FloatButtom
            onPress={() => {
              SNavigation.navigate('admin/evento/registro');
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
export default connect(initStates)(Entradas);
