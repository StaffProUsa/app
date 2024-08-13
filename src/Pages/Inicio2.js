import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import {
  SDate,
  SHr,
  SIcon,
  SImage,
  SInput,
  SLoad,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView,
  SBuscador,
  SOrdenador,
  SUtil
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Carrito from '../Components/Carrito';
import ImageBlur from '../Components/ImageBlur';
import PBarraFooter from '../Components/PBarraFooter';
import PBuscador from '../Components/PBuscardor';
import PButtom from '../Components/PButtom';
import PFecha from '../Components/PFecha';
import actividad from '../Services/Casagrandeadmin/Components/actividad';
import Eventos from '../Services/Casagrandeadmin/Components/evento';
import general from '../Services/Casagrandeadmin/Components/general';
import tipo_entrada from '../Services/Casagrandeadmin/Components/tipo_entrada';
import { FlatList } from 'react-native-gesture-handler';
import SVideo from '../Components/SVideo';
import Float from '../Components/Carrito/Float';


class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foto_id: 0
    };
    this.fechaAntes = 10000;
    this.ref = {}
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // Aquí puedes detectar los ítems que salieron de la vista y pausar su reproducción
    let makeVisible = false;

    changed.forEach(item => {

      if (!this.ref[item.key]) return;
      if (!item.isViewable) {

        if (this.ref[item.key].pause) {
          this.ref[item.key].pause()
        }
      } else {
        if (this.ref[item.key].play) {
          this.ref[item.key].play()
        }
      }
    });
  }
  getContenido({ key, img, titulo, descripcion, dia, mes, precio, fecha }) {
    const heig = Dimensions.get('window').height;
    const win = Dimensions.get('window').width;
    var precio_ok = "";
    var data_actividad = actividad.Actions.getByKeyEvento(key, this.props);
    if (!data_actividad) return null;

    if (precio != Infinity) {
      precio_ok = "Desde " + precio + " Bs.";
    }
    var fechaDiff = new SDate().diff(new SDate(fecha));

    var botonTexto = "";
    // console.log(this.fechaAntes)
    // console.log(fechaDiff + " DIFF")
    // if (fechaDiff > 0) {
    if (this.fechaAntes > fechaDiff) {
      botonTexto = "COMPRAR";
    } else {
      botonTexto = "VER";
    }
    this.fechaAntes = fechaDiff

    let arr = new SOrdenador([{ key: "index", order: "asc", peso: 1 }]).ordenarArray(data_actividad);
    let currentActivity = arr[0] ?? {}
    var imgPath = SSocket.api.root + 'actividad/' + currentActivity?.key;
    return <SView
      col={'xs-12'}
      style={{
        backgroundColor: STheme.color.card,
        borderRadius: 8,
        overflow: "hidden"
      }}
      centery
      activeOpacity={.9}
      onPress={() => {
        SNavigation.navigate('evento/perfil', { key: key });
      }}>
      <SView col={'xs-12'} style={{ overflow: 'hidden' }}>
        <SView col={"xs-12"} height={Dimensions.get('window').height / 1.8}>
          {currentActivity?.tipo == "video" ?
            <SVideo
              ref={ref => this.ref[key] = ref}
              src={
                imgPath
              } />
            : <ImageBlur
              ref={ref => this.ref[key] = ref}
              src={
                imgPath
              } height={"100%"} />
          }
        </SView>
      </SView>
      <SView col={'xs-12'} row center>
        <SView col={'xs-11'}>
          <SHr height={15} />
          <SText fontSize={16} style={{ textTransform: 'uppercase' }}>
            {titulo}
          </SText>
          <SHr height={10} />
          {/* <SText fontSize={16} style={{ textTransform: "uppercase" }}>foto {JSON.stringify(data_actividad[0].key)}</SText>
                <SHr height={10} /> */}
          <SView col={'xs-10'}>
            <SText fontSize={13} color={STheme.color.lightGray}>
              {descripcion}
            </SText>
            <SHr height={10} />
            <SText fontSize={16} color={STheme.color.primary}>
              {precio_ok}
            </SText>
          </SView>
        </SView>

        <SHr height={15} />
        <SView col={'xs-12'} center>
          <PButtom
            primary
            small
            fontSize={13}
            onPress={() => {
              // alert("Agregar al carrito")
              SNavigation.navigate('evento/perfil', { key: key });
            }}>
            {botonTexto}
          </PButtom>
        </SView>
        <SHr height={25} />
      </SView>
      <PFecha
        dia={dia}
        mes={mes}
        backgroundColor={STheme.color.secondary}
        position='bottom'
        spacing={45}
      />
    </SView>
  }



  getEventos() {
    var DATA = Eventos.Actions.getAll(this.props);
    if (!DATA) return <SLoad />;

    return <FlatList
      // scrollEnabled={false}
      onViewableItemsChanged={this.onViewableItemsChanged}
      data={Object.values(new SOrdenador([
        { key: "fecha", "order": "desc", "peso": 1 }
      ]).ordernarObject(DATA))}

      onEndReachedThreshold={0.3}
      viewabilityConfig={{
        minimumViewTime: 700,
        itemVisiblePercentThreshold: 75
      }}
      ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
      keyExtractor={item => (item).toString()}
      // getItemLayout={()}
      renderItem={({ item, index }) => {
        const key = item.key;
        const data = DATA[item]
        var precioMenor = tipo_entrada.Actions.getMenorEntrada(item.key, this.props);
        return this.getContenido({
          key: data.key,
          img: require('../Assets/images/evento1.jpg'),
          titulo: data.descripcion,
          descripcion: SUtil.limitString(data.observacion, 200),
          dia: new SDate(data.fecha).toString('dd'),
          mes: new SDate(data.fecha).toString('MONTH'),
          precio: precioMenor,
          fecha: new SDate(data.fecha)
        })
      }
      }
    />

    return new SOrdenador([
      { key: "fecha", "order": "desc", "peso": 1 }
    ]).ordernarObject(DATA).map((key) => {
      if (!SBuscador.validate(DATA[key], this.state.find)) {
        return null;
      }
      var precioMenor = tipo_entrada.Actions.getMenorEntrada(DATA[key].key, this.props);
      if (DATA[key - 1]) this.fechaAntes = new SDate(DATA[key - 1].fecha);
      // TODO
      // falta poner la foto del evento
      // falta poner el precio en tabla de eventos
      //falta validad si fecha es null

      return (
        <>
          {this.getContenido({
            key: DATA[key].key,
            img: require('../Assets/images/evento1.jpg'),
            titulo: DATA[key].descripcion,
            descripcion: DATA[key].observacion,
            dia: new SDate(DATA[key].fecha).toString('dd'),
            mes: new SDate(DATA[key].fecha).toString('MONTH'),
            precio: precioMenor,
            fecha: new SDate(DATA[key].fecha)
          })}
        </>
      );
    });
  }
  render() {
    // var generals = general.Actions.getAll(this.props);

    return (
      <>
        <SPage title={'Pedidos de Hoy'} hidden onRefresh={(e) => {
          if (e) e();
          actividad.Actions._getReducer(this.props).data = null;
          Eventos.Actions._getReducer(this.props).data = null;
          Eventos.Actions.getAll(this.props);
        }} disableScroll>
          <SView col={'xs-12'} center flex>
            <SView
              col={'xs-12 sm-11 md-10 lg-8 xl-6'} flex>
              {this.getEventos()}
            </SView>
          </SView>

          {/* <SView col={'xs-12'} center>
            <SView
              col={'xs-12 sm-11 md-10 lg-8 xl-6'}
              row
              center
              backgroundColor={'transparent'}>
              <SHr height={12} />
              <SView col={'xs-12'} center style={{ borderRadius: 8 }}>
                <PBuscador onChangeText={(text) => {
                  this.setState({
                    find: text
                  })
                }}
                />
                <SHr height={10} />
                {this.getEventos()}
              </SView>
            </SView>
          </SView> */}
        </SPage>
        <PBarraFooter url={'inicio'} />
        {/* <Float /> */}
        <Carrito style={{
          bottom: 0,
          top: 90,
        }} />
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Inicio);
