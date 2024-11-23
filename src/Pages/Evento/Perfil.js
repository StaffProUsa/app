import React from 'react';
import { connect } from 'react-redux';
import {
  SDate,
  SGradient,
  SHr,
  SIcon,
  SImage,
  SList,
  SLoad,
  SNavigation,
  SOrdenador,
  SPage,
  SScrollView2,
  SText,
  STheme,
  SThread,
  SView,
  SLanguage,
  SNotification
} from 'servisofts-component';
import PackageJson from "../../../package.json"
import actividad from '../../Services/Casagrandeadmin/Components/actividad';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import evento from '../../Services/Casagrandeadmin/Components/evento';
import SSocket from 'servisofts-socket';
import PFecha from '../../Components/PFecha';
import banner from '../../Services/Casagrandeadmin/Components/banner';
import ImageBlur from '../../Components/ImageBlur';
import TextWithLink from '../../Components/TextWithLink';
import SVideo from '../../Components/SVideo';
import Compartir from '../../Components/Compartir';
import PBarraFooter from '../../Components/PBarraFooter';
import Model from '../../Model';
import { Platform } from 'react-native';
import EventoQR from './Components/EventoQR';
import { Container } from '../../Components';
import EventoStaff from './Components/EventoStaff';
import Mapa from './Components/Mapa';
import Asistencia from './Components/Asistencia';
import MisTrabajosDelEvento from './Components/MisTrabajosDelEvento';
import TrabajosDelEvento from './Components/TrabajosDelEvento';
import MarcarPorCodigoEvento from '../../Components/Asistencia/MarcarPorCodigoEvento';

const SPACE = 50;

class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foto_id: 0
    };

    this.keyRestaurante = '0790c035-740d-4178-9113-dad1fb532e05';
    this.key = SNavigation.getParam('key');

    // var arr = Array.from(Array(10).keys())
    // var arrFoto = Array.from(Array(5).keys())
    this.arr = Array.from(Array(10).keys());
    this.arrFoto = Array.from(Array(5).keys());
    this.bgSpace = 'transparent';
    this.bgborder = 'transparent';
  }
  componentDidMount() {
    new SThread(100, "asdasd", true).start(() => {
      this.getData();
      this.setState({ ready: true })
    })
  }

  getData() {
    SSocket.sendPromise({
      component: "evento",
      type: "getPerfil",
      key: this.key,
      key_usuario: Model.usuario.Action.getKey() ?? "",
      tipo: Platform.OS,
      device_info: {
        OS: Platform.OS,
        version: PackageJson.version,
        descripcion: Platform.select({
          "web": `Web ${window.navigator.userAgent}`,
          "android": `Android ${Platform?.constants?.Version}, ${Platform?.constants?.Manufacturer} ${Platform?.constants?.Brand} ${Platform?.constants?.Model}`,
          "ios": `IOS ${Platform?.Version}, ${Platform?.constants?.systemName}`,
        }),
      }
    }).then(e => {
      this.setState({ data: e.data })
    }).catch(e => {
      SNotification.send({
        title: "Error",
        body: e.error ?? "No se pudo completar la accion."
      })
    })
  }
  getBtnFooter() {
    var { total, cantidad } = carrito.Actions.getInfo(this.props);
    if (!cantidad) return null;
    return (
      <>
        <SView
          col={'xs-12 '}
          center
          height={70}
          style={{ bottom: 0 }}
          backgroundColor={STheme.color.primary}
          onPress={() => {
            cantidad == 0
              ? SNavigation.navigate('carrito/mensajeCarritoVacio')
              : SNavigation.navigate('/carrito');
          }}>
          <Container>
            <SView col={'xs-12'} row center>
              <SView flex height={40} border={this.bgborder}>
                <SText
                  color={STheme.color.secondary}
                  font={'Roboto'}
                  fontSize={15}>{`${cantidad} items`}</SText>
                <SText
                  color={STheme.color.secondary}
                  font={'Roboto'}
                  fontSize={22}>{`Bs. ${total.toFixed(2)}`}</SText>
              </SView>
              <SView flex padding={5} style={{
                backgroundColor: STheme.color.secondary,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#eeeeee',
              }}>
                <SText
                  center
                  color={STheme.color.text}
                  font={'Roboto'}
                  fontSize={20}>
                  MIS COMPRAS
                </SText>
              </SView>
            </SView>
          </Container>
        </SView>
      </>
    );
  }

  getHeader() {
    return (
      <>
        <SView col={'xs-12'} height={64} border={this.bgborder} center>
          <SView col={'xs-12'} center height={60}>
            <SView
              col={'xs-12'}
              height
              center
              style={{ justifyContent: 'center' }}
              border={'transparent'}>
              <SIcon
                name={'Logo'}
                fill={STheme.color.primary}
                height={54}
                width={150}
              />
            </SView>
          </SView>
        </SView>
      </>
    );
  }

  getFecha() {
    var DATA = this.state.data;
    if (!DATA) return <SLoad />;
    console.log("data fecha", DATA.fecha);
    return (
      <>
        {/* <SView width={70} center height={125} style={{ top: 40, right: 0, position: "absolute", }} border={"transparent"} >
        <SIcon name={'BgDate'} fill={STheme.color.card} style={{ position: "absolute" }} />
        <SView col={"xs-12"} row style={{ justifyContent: 'flex-end', }} border={"transparent"} >
          <SText fontSize={32} color={STheme.color.text} font={"Roboto"}>{new SDate(DATA.fecha).toString("dd")}</SText>
          <SText fontSize={15} color={STheme.color.text} font={"Roboto"}>{new SDate(DATA.fecha).toString("MONTH")}</SText>
        </SView>
      </SView> */}
        <PFecha
          dia={new SDate(DATA.fecha).toString('dd')}
          mes={new SDate(DATA.fecha).getMonth()}
          backgroundColor={STheme.color.secondary}
          position='top'
          spacing={10}
          style={{

            zIndex: 999
          }}
        />
      </>
    );
  }

  getBotones(DATA) {
    // console.log(DATA);
    var fechaHoy = new SDate();
    if (DATA.fecha <= fechaHoy) return;
    if (!DATA.estado_venta) return;
    return (
      <>
        <SView
          col={'xs-12'}
          height={64}
          center
          backgroundColor={STheme.color.card}
          style={{ borderRadius: 8 }}>
          <SView
            col={'xs-12'}
            row
            height
            onPress={() => {
              SNavigation.navigate('ticket/entrada', { key: this.key });
            }}>
            <SView width={60} height border={'transparent'} center>
              <SIcon
                name={'Ticket'}
                fill={STheme.color.text}
                height={45}
                width={45}
              />
            </SView>
            <SView width={16} />
            <SView
              flex
              height
              style={{ justifyContent: 'center' }}
              border={'transparent'}>
              <SText color={STheme.color.text} font={'Roboto'} fontSize={16}>
                Entradas
              </SText>
            </SView>
          </SView>
        </SView>
        <SHr height={16} color={this.bgSpace} />

        <SView
          col={'xs-12'}
          height={64}
          center
          backgroundColor={STheme.color.card}
          style={{ borderRadius: 8 }}>
          <SView
            col={'xs-12'}
            row
            height
            onPress={() => {
              SNavigation.navigate('ticket/reserva', { key: this.key });

            }}>
            <SView width={60} height border={'transparent'} center>
              <SIcon
                name={'Group'}
                fill={STheme.color.text}
                height={43}
                width={45}
              />
            </SView>
            <SView width={16} />
            <SView
              flex
              height
              style={{ justifyContent: 'center' }}
              border={'transparent'}>
              <SText color={STheme.color.text} font={'Roboto'} fontSize={16}>
                Reservas
              </SText>
            </SView>
          </SView>
        </SView>
        <SHr height={40} color={this.bgSpace} />
      </>
    );
  }

  getBody() {
    // console.log("romeo ", this.state.foto_id);
    // console.log("siles ", DATA_FOTO.length);
    var DATA = this.state.data;
    var data_actividad = DATA?.actividades

    if (!DATA) return <SLoad />;

    // if (!data_actividad) return <SLoad />;
    let arr = new SOrdenador([{ key: "index", order: "asc", peso: 1 }]).ordenarArray(data_actividad ?? []);
    let currentActivity = arr[0] ?? null
    if (!this.state.foto_id) {
      this.state.foto_id = Object.values(data_actividad ?? {})[0]?.key;
      // console.log(data_actividad)
      this.state.foto_id = currentActivity?.key;
      // console.log(this.state.foto_id);

    } else {
      currentActivity = arr.find(a => a.key == this.state.foto_id)
    }
    return (
      console.log("dataaaaa ", DATA),
      <>
        <SView col={'xs-12'} border={this.bgborder} center row>
          <SView col={"xs-12"} center>
            <SView width={40} height={40} style={{
              borderRadius: 8,
              overflow: "hidden"
            }}>
              <SImage src={SSocket.api.root + "cliente/" + DATA?.cliente?.key} style={{ resizeMode: "cover" }} />
            </SView>
            <SText col={"xs-8"} center color={STheme.color.text} bold font={'Roboto'} fontSize={24}>
              {DATA?.cliente?.descripcion}
            </SText>
            <SHr h={4} />
            <SText col={"xs-8"} center color={STheme.color.text} bold font={'Roboto'} fontSize={20}>
              {DATA.descripcion}
            </SText>
            <SHr height={15} />
            <SView col={"xs-6"} style={{
              borderBottomColor: STheme.color.card,
              borderStyle: 'dashed',
              borderBottomWidth: 3
              // width: 10

            }} />
            <SHr h={35} />
          </SView>
          <SView col={"xs-11.5"}>
            <SText fontSize={20} bold justify language={{
              es: "Detalles del evento",
              en: "Event details"
            }} />
            <SHr height={15} />
          </SView>
          <SHr h={1} color={STheme.color.lightGray} />
          {!currentActivity ? null : <>
            <SView col={"xs-11.5"} height={355}>
              {currentActivity?.tipo == "video" ?
                <SVideo src={
                  SSocket.api.repo +
                  'actividad/' +
                  this.state.foto_id
                } height={355} />
                : <ImageBlur
                  src={
                    SSocket.api.repo +
                    'actividad/' +
                    this.state.foto_id
                  } height={355} />
              }
            </SView>
            <SView col={'xs-12'} height={4} backgroundColor={'transparent'} />
            <SView col={'xs-11.5'} height={55} backgroundColor={'transparent'}>
              <SScrollView2>
                <SList
                  // data={Object.values(data_actividad ?? 0).sort((a, b) => a.index != b.index ? (a.index > b.index ? 1 : -1) : (new SDate(a.fecha_on,"yyyy-MM-ddThh:mm:ss").getTime() > new SDate(b.fecha_on,"yyyy-MM-ddThh:mm:ss").getTime() ? 1 : -1))}
                  data={(data_actividad ?? []).sort((a, b) => a.index != b.index ? (a.index > b.index ? 1 : -1) : (new SDate(a.fecha_on, "yyyy-MM-ddThh:mm:ss").getTime() > new SDate(b.fecha_on, "yyyy-MM-ddThh:mm:ss").getTime() ? 1 : -1))}
                  horizontal={true}
                  // order={[{ key: "index", order: "asc", peso: 1 }]}
                  render={(obj, key) => {
                    // obj.key = key;
                    // console.log("obj. ", obj.key);
                    return (
                      <SView
                        width={50}
                        height={50}
                        card
                        onPress={() => {
                          // alert(obj.key);
                          // this.foto_id = obj.foto;
                          this.setState({ foto_id: obj.key });
                          // console.log("final ", this.state.foto_id);
                        }}>
                        <SImage
                          src={
                            SSocket.api.repo +
                            'actividad/' +
                            obj.key
                          }
                          style={{
                            width: '100%',
                            position: 'relative',
                            resizeMode: 'cover',
                            borderRadius: 4
                          }}
                        />
                        <SImage
                          src={obj.foto}
                          style={{
                            width: '100%',
                            position: 'relative',
                            resizeMode: 'cover',
                            borderRadius: 4
                          }}
                        />

                        <SView
                          width={50}
                          height={50}
                          backgroundColor={
                            obj.key == this.state.foto_id
                              ? '#FFFFFF' + 99
                              : 'transparent'
                          }
                          style={{ position: 'absolute', borderRadius: 4 }}></SView>
                        {/* <SText>{obj.index}</SText> */}
                      </SView>
                    );
                  }}
                />
              </SScrollView2>
            </SView>
          </>}
          <SView col={'xs-11.5'} border={this.bgborder} center
            style={{
              // backgroundColor: STheme.color.card,
              borderRadius: 4,
            }}>
            <SHr height={20} />
            <SView col={"xs-12"}>
              <TextWithLink
                // center
                justify
                color={STheme.color.gray}
                font={'Roboto'}
                fontSize={14}>
                {DATA.observacion}
              </TextWithLink>
            </SView>
            <SHr height={20} />
            <SHr h={1} color={STheme.color.lightGray} />
            <SHr height={20} />
            <SView col={"xs-12"} row>
              <SView col={"xs-6"}>
                <SText fontSize={16} bold justify language={{
                  es: "Fecha",
                  en: "Date"
                }} />
                <SText fontSize={18} justify>{new SDate(DATA?.fecha).toString("MONTH dd, yyyy")}</SText>
              </SView>

              <SView col={"xs-6"} style={{
                borderLeftWidth: 1,
                borderLeftColor: STheme.color.lightGray
              }}>
                <SText fontSize={16} center bold justify language={{
                  es: "Autorización para trabajar en USA",
                  en: "Work authorization in USA"
                }} style={{
                  paddingLeft: 5
                }} />
                <SText center fontSize={18} justify>{(DATA?.cliente?.papeles) ? SLanguage.select({ es: "SÍ", en: "YES" })  : "NO"}</SText>
              </SView>
            </SView>

            <SHr height={20} />
            <SHr h={1} color={STheme.color.lightGray} />
            <SHr height={20} />

            <SView col={"xs-12"}>
              <SText fontSize={16} bold justify language={{
                es: "Más información",
                en: "More information"
              }} />
              <SText fontSize={16} justify>{(DATA?.cliente?.observacion)}</SText>
            </SView>


            {/* MOSTRAR EN COMPANY */}
            {/* <SView row center col={"xs-12"}>
              <SView flex />
              <SView height={25} width={30} center style={{
                paddingTop: 1
              }}>
                <SIcon name={"Eyes"} fill={STheme.color.lightGray} height={25} />
              </SView>
              <SView width={4} />
              <SText bold>{DATA?.visitas}</SText>
            </SView> */}
          </SView>


          <SHr height={16} color={this.bgSpace} />
          {/* MOSTRAR EN COMPANY */}
          {/* {this.renderCompartir(DATA)} */}
          <SHr height={16} color={this.bgSpace} />
          {this.getBotones(DATA)}

          {/* <SView col={'xs-12'} height={355}> */}


        </SView >
      </>
    );
  }

  renderCompartir(DATA) {
    return <SView col={"xs-12"} center row>
      <SView width={220} height={40} row style={{

        borderRadius: 8,
        // borderBottomRightRadius: 8,
        borderWidth: 0,
        overflow: "hidden",
        // borderColor: STheme.color.primary
      }} onPress={() => {
        Compartir.open({
          type: "",
          url: `https://casagrande.servisofts.com/link/evento?key=${DATA.key}`,
          message: DATA.observacion,
          //           message: `
          // ${DATA.descripcion}
          // ${DATA.observacion}\n
          // https://casagrande.servisofts.com/link/evento?key=${DATA.key}
          // `,
          // url: "https://casagrande.servisofts.com/evento?key=" + DATA.key,
        })
      }} >
        <SView width={50} backgroundColor={STheme.color.secondary} center>
          <SIcon name={'shareIcon'} fill={STheme.color.text} height={20} width={20} />
        </SView>
        {/* <SView width={7} /> */}
        <SView flex height center backgroundColor={STheme.color.text}>
          <SText center bold fontSize={18} color={STheme.color.black}>Share event</SText>
        </SView>
        {/* <SText center  bold fontSize={18}>COMPARTIR</SText> */}
      </SView>
    </SView >
  }
  getPublicidad() {
    // console.log(DATA['0790c035-740d-4178-9113-dad1fb532e05']);
    // console.log(DATA['0790c035-740d-4178-9113-dad1fb532e05'].descripcion);
    const dataPublicidad = this.state?.data?.banners;
    // const dataPublicidad = banner.Actions.getAll(this.props);
    // console.log(JSON.stringify(dataPublicidad));
    return (
      <>
        <SView col={'xs-12'} height={110} border={this.bgborder}>
          <SList
            data={dataPublicidad}
            // data={this.arr}

            space={20}
            horizontal={true}
            render={(obj) => {
              return (
                <SView width={100} height={100}>
                  <SImage
                    // src={obj.foto}
                    enablePreview
                    src={
                      SSocket.api.repo +
                      'banner/' +
                      obj.key
                    }
                    border={'blue'}
                    style={{
                      width: '100%',
                      position: 'relative',
                      resizeMode: 'cover',
                      borderRadius: 8
                    }}
                  />
                </SView>
              );
            }}
          />
        </SView>
      </>
    );
  }

  render() {
    // if (!this.state.ready) return <SLoad />
    // console.log("data ubicacion", this.state.data);
    return (
      <>
        <SPage onRefresh={e => {
          // evento.Actions.clear(this.props);
          // actividad.Actions.clear(this.props);
          // banner.Actions.clear(this.props);
          this.setState({ data: null })
          this.getData();
          if (e) e()
        }}
        // footer={<PBarraFooter url={''} />}
        >
          {!this.state.ready ? <SLoad /> :
            <SView col={'xs-12'} center>
              <SView
                col={'xs-12 sm-12 md-10 lg-8 xl-6'}
                row
                center
                backgroundColor={'transparent'}>

                {/* {this.getHeader()} */}

                {/* <SHr height={SPACE} /> */}

                <SHr height={15} />
                {this.getBody()}

                {/* GET STAFF APPLY */}
                {/* <SView col={'xs-11.5'} style={{ borderRadius: 16, overflow: "hidden" , borderWidth:1, borderColor:STheme.color.darkGray}}>
                  <SGradient
                    colors={['#040405', '#0C0C10']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <SHr height={15} />
                  <SText fontSize={20} padding={10} bold justify language={{
                    es: "Requiere:",
                    en: "Requires:"
                  }} />
                  <SHr height={15} />
                  <EventoStaff key_evento={this.key} />
                  <SHr height={15} />
                </SView> */}

                <SHr h={1} color={STheme.color.lightGray} />
                <SHr height={20} />

                {/* STAFF ASISTENCIA */}
                {/* <SView col={'xs-11.5'}>
                  <Asistencia  data={this.state.data}/>
                </SView>  */}
                <MarcarPorCodigoEvento key_evento={this.key}/>
                <SView col={'xs-11.5'}>
                  {/* <MisTrabajosDelEvento key_evento={this.key} /> */}
                  <TrabajosDelEvento key_evento={this.key} />
                </SView>
                <SHr height={30} />
                <SView col={'xs-11.5'} >
                  <SText fontSize={20} bold justify language={{
                    es: "Ubicación",
                    en: "Ubication"
                  }} />
                </SView>
                <SHr height={20} />
                <Mapa height={400} data={this.state.data} />
                {this.getFecha()}
                {/* <SHr height={60} color={this.bgSpace} /> */}
                {/* {this.getPublicidad()} */}
                {/* <SHr height={100} color={this.bgSpace} /> */}
                {/* <EventoQR key_evento={this.key} /> */}
                <SHr height={100} color={this.bgSpace} />

              </SView>
              
            </SView>
          }
        </SPage>
        {/* <Carrito style={{
          bottom: 12
        }} /> */}
        {this.getBtnFooter()}
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Perfil);
// export default (Perfil);
