import React from 'react';
import { connect } from 'react-redux';
import {
  SDate,
  SHr,
  SIcon,
  SList,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  SScrollView2,
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
import { Container } from '../../Components';

class Lista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.key_usuario = SNavigation.getParam("pk");
  }

  componentDidMount() {
    SSocket.sendPromise({
      component: "evento",
      type: "getAll",
      key_usuario: SNavigation.getParam("pk"),
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
    // data[item.key] = dataEntradas
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
            label: 'Entradas',
            width: 60,
            center: true,
            component: (key) => {
              console.log("entradas", data[key].entradas)
              return (
                <SView
                  onPress={() => {
                    SNavigation.navigate('/usuario/entradas', { pk: this.key_usuario, pk_evento: key });
                  }}>
                  <SIcon name={'TipoEntrada'} width={35} />
                </SView>
              );
            }
          },
          {
            key: 'key-tipo-sector',
            label: 'Mesas',
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

  getItemsEntradas(dataItems) {
    if (dataItems.length === 0) return <SView col={"xs-12"} center><SText>Sin datos</SText></SView>
    return <SList
      data={dataItems}
      limit={4}
      order={[{ "key": "fecha_on", order: "desc", type: "date" }]}
      render={(f) => {

        return <SView col={"xs-12"} style={{
          backgroundColor: STheme.color.gray,
          padding: 5,
          borderRadius: 5,
          borderLeftWidth: 5,
          borderColor: STheme.color.success
        }}
          onPress={() => {
            SNavigation.navigate('/entradas/profile', { key_entrada: f.key });
          }}
        >
          <SText center fontSize={17} font='OpenSans-Bold'># {f.numero}</SText>
        </SView>
      }}
    />
  }

  getItemsMesas(dataItems, key_evento) {
    if (dataItems.length === 0) return <SView col={"xs-12"} center><SText>Sin datos</SText></SView>
    return <SList
      // scrollEnabled={true}
      // numColumns={4}

      data={dataItems}
      limit={4}
      order={[{ "key": "fecha_on", order: "desc", type: "date" }]}
      render={(f, index) => {
        let numero = Number(index) + 1;
        return <SView col={"xs-12"} style={{
          backgroundColor: STheme.color.gray,
          padding: 5,
          borderRadius: 5,
          borderLeftWidth: 5,
          borderColor: STheme.color.warning
        }}
          onPress={() => {
            SNavigation.navigate('/entradas/mesa/profile', { pk: f.key, key_evento: key_evento });
          }}
        >
          <SText center fontSize={17} font='OpenSans-Bold'># {numero}</SText>
        </SView>
      }}
    />
  }

  getEventosLista() {
    if (!this.state.data) return <SLoad />;
    var data = this.state.data;
    var data_usuario = usuario.Actions.getAll(this.props);
    if (Object.keys(data).length === 0) return <SView col={"xs-12"} center><SText>Sin registros</SText></SView>;
    if (!data_usuario) return <SLoad />;

    return <SList
      data={this.state.data}
      limit={5}
      order={[{ "key": "fecha_on", order: "desc", type: "date" }]}
      render={(e) => {

        return <SView col={"xs-12"} row card center
          style={{
            padding: 10,
          }}
        >
          <SView col={'xs-12'} style={{
            borderBottomWidth: 1,
            borderColor: STheme.color.lightGray
          }}>
            <SText clean bold fontSize={16}>{(e.descripcion ?? "").substring(0, 100)}</SText>
            <SText fontSize={12} color={STheme.color.gray}>
              {new SDate(e.fecha).toString('DAY, dd de MONTH del yyyy')}
            </SText>
            <SHr />
          </SView>
          <SView col={'xs-12'}  >
            <SHr />
            {/* <SScrollView2   > */}
            <SView col={'xs-12'} row>
              <SView col={'xs-5.5'} row>
                <SView col={'xs-12'} row height={40} >
                  <SIcon name={'TipoEntrada'} fill={STheme.color.secondary} height={35} width={35} />
                  <SView width={5} />
                  <SText center>Entradas </SText>
                  <SText center>({e.entradas?.length})</SText>
                </SView>
                <SView col={'xs-12'} height={195} >
                  <SScrollView2>
                    {this.getItemsEntradas(e.entradas)}
                  </SScrollView2>
                </SView>
              </SView>
              <SView col={'xs-1'} row />
              <SView col={'xs-5.5'} row >
                <SView col={'xs-12'} row height={40} >
                  <SIcon name={'Sector'} fill={STheme.color.secondary} height={35} width={35} />
                  <SView width={5} />
                  <SText center>Mesas </SText>
                  <SText center>({e.mesas.length})</SText>
                </SView>
                <SView col={'xs-12'} height={195} >
                  <SScrollView2>
                    {this.getItemsMesas(e.mesas, e.key)}
                  </SScrollView2>
                </SView>
              </SView>
            </SView>
            {/* </SScrollView2> */}
          </SView>
        </SView>
      }}
    />
  }

  render() {
    return (
      <>
        <SPage title={'Lista'} >
          <Container >
            {this.getEventosLista()}
            {/* {this.getEventosTabla()} */}
            <SHr h={20} />
          </Container>
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Lista);
