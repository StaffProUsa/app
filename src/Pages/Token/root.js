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
  SOrdenador,
  SPage,
  SScrollView2,
  SText,
  STheme,
  SThread,
  SView
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

const SPACE = 50;

class Token extends React.Component {
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

    })
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
          mes={new SDate(DATA.fecha).toString('MONTH')}
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
    if (!data_actividad) return <SLoad />;
    let arr = new SOrdenador([{ key: "index", order: "asc", peso: 1 }]).ordenarArray(data_actividad);
    let currentActivity = arr[0] ?? {}
    if (!this.state.foto_id) {
      this.state.foto_id = Object.values(data_actividad)[0]?.key;
      // console.log(data_actividad)
      this.state.foto_id = currentActivity?.key;
      // console.log(this.state.foto_id);

    } else {
      currentActivity = arr.find(a => a.key == this.state.foto_id)
    }
    return (
      <>
        <SView col={'xs-12'} border={this.bgborder} center row>

          <SView col={"xs-12"} center>
            <SText col={"xs-8"} center color={STheme.color.text} bold font={'Roboto'} fontSize={24}>
              {DATA.descripcion}
            </SText>


            <SHr height={15} />
            <SView col={"xs-6"} style={{
              borderBottomColor: STheme.color.card,
              // borderBottomColor: "#B07E49",
              borderStyle: 'dashed',
              borderBottomWidth: 3
              // width: 10

            }} />
            <SHr h={35} />
          </SView>

          <SView col={"xs-12"} height={355}>
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
          {/* <SImage
              src={
                SSocket.api.root +
                'actividad/' +
                this.state.foto_id
              }
              style={{ width: '100%', resizeMode: 'contain', borderRadius: 8 }}
            /> */}
          {/* </SView> */}

          <SView col={'xs-12'} height={4} backgroundColor={'transparent'} />
          <SView col={'xs-12'} height={55} backgroundColor={'transparent'}>
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


          <SView col={'xs-12'} border={this.bgborder} center
            style={{
              // backgroundColor: STheme.color.card,
              borderRadius: 4,
              padding: 5,
            }}>

            <SHr />


            <SView col={"xs-12"}>
              <TextWithLink
                // center
                justify
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={12}>
                {DATA.observacion}
              </TextWithLink>
            </SView>

            <SHr />
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
         
        </SPage>
       
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Token);
// export default (Perfil);