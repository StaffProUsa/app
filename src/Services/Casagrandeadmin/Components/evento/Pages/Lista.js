import React from 'react';
import { connect } from 'react-redux';
import {
  SDate,
  SHr,
  SIcon,
  SImage,
  SList,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  STable2,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import evento from '..';
import FloatButtom from '../../../../../Components/FloatButtom';
import usuario from '../../../../Usuario/Components/usuario/';
import SSocket from 'servisofts-socket';
import { Container } from '../../../../../Components';
import Actividad from '../../actividad';


class Lista extends React.Component {
  constructor(props) {
    super(props);
  }

  getEventosLista() {
    var data = evento.Actions.getAll(this.props);
    var data_usuario = usuario.Actions.getAll(this.props);
    if (!data) return <SLoad />;
    if (!data_usuario) return <SLoad />;
    return <SList
      data={data}
      limit={10}
      order={[{ key: "fecha", order: "desc" }]}
      filter={d => d.estado != 0}
      render={(obj) => {
        //console.log(obj)
        var dataActividad = Actividad.Actions.getByKeyEvento(obj.key, this.props);
        if (!dataActividad) return <SLoad />;
        return (
          <SView col={'xs-12'} row center card
            style={{
              padding: 10,
            }}
            onPress={() => {
              SNavigation.navigate('admin/evento/perfil', { key: obj.key });
            }}
          >
            <SView col={'xs-3'} row center>
              <SView width={60} height={60}>
                <SImage
                  src={
                    SSocket.api.root +
                    'actividad/' +
                    dataActividad[0]?.key
                  }
                  style={{
                    width: '100%',
                    position: 'relative',
                    resizeMode: 'cover',
                    borderRadius: 4
                  }}
                />
              </SView>
            </SView>
            <SView col={'xs-9'} >
              <SText fontSize={14} bold>{obj.descripcion}</SText>
              <SText fontSize={13}>{new SDate(obj.fecha).toString("dd/MM/yyyy")}</SText>
            </SView>
          </SView>

        );
      }}
    />
  }
  header() {
    return (
      <SView col={'xs-12'} center row>
        <SView col={'xs-6'} center
          style={{
            borderWidth: 2,
            borderColor: STheme.color.primary,
            backgroundColor: STheme.color.primary,
            padding: 15,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
          onPress={() => {
            SNavigation.navigate('admin/evento');
          }}
        >
          <SText fontSize={20} color={STheme.color.secondary} bold>LISTA</SText>
        </SView>
        <SView col={'xs-6'} center
          style={{
            borderWidth: 2,
            borderColor: STheme.color.primary,
            padding: 15,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
          }}
          onPress={() => {
            SNavigation.navigate('admin/evento/tabla');
          }}
        >
          <SText fontSize={20} bold>TABLA</SText>
        </SView>
        <SHr height={10} />
      </SView>
    );
  }

  render() {
    return (
      <>
        <SPage title={'Lista'} onRefresh={(e) => {
          if (e) e()
          evento.Actions._getReducer(this.props).data = null;
          Actividad.Actions._getReducer(this.props).data = null;
          evento.Actions.getAll(this.props);
          this.setState({ ...this.state })
        }} header={<>
          <Container>
            {this.header()}
          </Container>
          <FloatButtom
            style={{
              position: 'absolute',
              bottom: 10,
              right: 5,
              zIndex: 999
            }}
            onPress={() => {
              SNavigation.navigate('admin/evento/registro');
            }}
          />
        </>}>

          <Container>
            {/* <SView flex /> */}

            <SHr height={10} />
            <SView col={'xs-12'} center  >
              {this.getEventosLista()}
              {/* {this.getEventosTabla()} */}
            </SView>
            <SHr height={30} />
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
