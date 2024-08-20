import React from 'react';
import { connect } from 'react-redux';
import { SHr, SLoad, SPage, SText, SView, SNavigation, STheme, SDate, SIcon, SImage, SScrollView2, SList, SPopup, SForm } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import evento from '..';
import Actividad from '../../actividad';
import TipoEntrada from '../../tipo_entrada';
import Sector from '../../sector';
import actividad from '../../actividad';
import sector from '../../sector';
import tipo_entrada from '../../tipo_entrada';


const ImageSize = {
  width: 720,
  height: 1280
}
class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key = SNavigation.getParam('key');
  }

  listaActividades() {
    var dataActividad = Actividad.Actions.getByKeyEvento(this.key, this.props);
    if (!dataActividad) return <SLoad />;
    if (Object.keys(dataActividad).length === 0) return <SText fontSize={16} height={50}>Sin registros...</SText>;

    return (
      <>
        <SView col={'xs-12  '} height={110} border={this.bgborder}>
          <SScrollView2>
            <SList
              data={dataActividad}
              // data={this.arr}
              order={[{ key: "index", order: "asc", type: "number" }]}
              space={20}
              horizontal={true}
              render={(obj) => {
                return (
                  <SView width={100} height={100}>
                    <SImage
                      // src={obj.foto}
                      enablePreview
                      src={
                        SSocket.api.root +
                        'actividad/' +
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
          </SScrollView2>
        </SView>
      </>
    )
  }

  getActividades() {
    return (
      <>
        <SView col={'xs-12'} center row>
          <SText fontSize={25}>Actividades</SText>
          <SHr height={25} />
          {this.listaActividades()}
          <SHr height={5} />
          <SView col={'xs-11'} row center>
            <SView col={'xs-9'}></SView>
            <SView col={'xs-10 sm-3 md-3 lg-3 xl-3'} >
              <SView
                center
                style={{
                  borderRadius: 10,
                }}
                onPress={() => {
                  SNavigation.navigate('admin/actividad', { key: this.key });
                }}
                backgroundColor={'#0077B5'}
                height={40}
              >
                <SText fontSize={14}>AÑADIR</SText>
              </SView>
            </SView>
          </SView>
        </SView>
      </>
    )
  }

  getDataEvento() {
    let data = {};
    if (this.key) {
      data = evento.Actions.getByKey(this.key, this.props);
      if (!data) return <SLoad />;
      let dia = new SDate(data['fecha'], "yyyy-MM-dd").toString('dd');
      let mes = new SDate(data['fecha'], "yyyy-MM-dd").toString('MONTH');
      let anio = new SDate(data['fecha'], "yyyy-MM-dd").toString('yyyy');
      let item = data['key']
      return (
        <>
          <SView col={'xs-12'} center row>
            <SView col={'xs-12'} center >
              <SText fontSize={18}>{data['descripcion']}</SText>
            </SView>
            <SHr height={10} />
            <SView col={'xs-12'} height={5} style={{ backgroundColor: STheme.color.card, }} />
            <SHr height={30} />
            <SView col={'xs-12'} row center>
              <SView col={'xs-12 sm-8 md-8 lg-8 xl-8'} >
                <SText fontSize={14}>{data['observacion']}</SText>
                <SHr height={20} />
              </SView>
              <SView col={'xs-12 sm-4 md-4 lg-4 xl-4'} center row>
                <SView col={'xs-9'}
                  backgroundColor={STheme.color.card}
                  style={{
                    borderRadius: 15,
                    height: 150,
                    borderWidth: 1,
                    borderColor: STheme.color.primary
                  }}
                  center
                >
                  <SText fontSize={40}>{dia}</SText>
                  <SText fontSize={20}>{mes}</SText>
                  <SText fontSize={25}>{anio}</SText>
                </SView>
                <SHr height={15} />
                <SView col={'xs-9'} center row>
                  <SView col={'xs-12'}  >
                    <SView
                      center
                      style={{
                        borderRadius: 10
                      }}
                      onPress={() => {
                        SNavigation.navigate('admin/evento/registro', { key: item });
                      }}
                      backgroundColor={'#53B15B'}
                      height={40}
                    >
                      {/* <SIcon name={'Edit'} width={35} /> */}
                      <SText fontSize={14}>EDITAR</SText>
                    </SView>
                    <SHr height={15} />
                    <SView
                      center
                      style={{
                        borderRadius: 10
                      }}
                      onPress={() => {
                        // SNavigation.navigate('admin/evento/registro', { key: item });
                        SPopup.confirm({
                          title: 'Eliminar',
                          message: '¿Esta seguro de eliminar?',
                          onPress: () => {
                            evento.Actions.eliminar(data, this.props);
                            SNavigation.goBack();
                          }
                        });
                      }}
                      backgroundColor={STheme.color.danger}
                      height={40}
                    >
                      {/* <SIcon name={'Edit'} width={35} /> */}
                      <SText fontSize={14}>ELIMINAR</SText>
                    </SView>

                  </SView>
                </SView>
              </SView>
            </SView>
            <SHr height={25} />
            <SView col={'xs-12'} row center>
              <SText bold fontSize={16} color={STheme.color.link} underLine onPress={() => {
                // http://localhost:3000/reportes/ventas_por_evento_detalle?fecha_fin=2024-05-31&fecha_inicio=2024-05-01&key_evento=4040028a-12d6-4f01-868c-72b3d67c9a80
                SNavigation.navigate("/reportes/ventas_por_evento_detalle", {
                  fecha_inicio: "2000-01-01",
                  fecha_fin: "2099-01-01",
                  key_evento: this.key
                })
              }}>{"REPORTE DE VENTAS"}</SText>
            </SView>
            <SHr />
            <SView col={'xs-12'} row center>
              <SText bold fontSize={16} color={STheme.color.link} underLine onPress={() => {
                // http://localhost:3000/reportes/ventas_por_evento_detalle?fecha_fin=2024-05-31&fecha_inicio=2024-05-01&key_evento=4040028a-12d6-4f01-868c-72b3d67c9a80
                SNavigation.navigate("/reportes/entradas_por_evento", {
                  key_evento: this.key
                })
              }}>{"REPORTE DE ENTRADAS"}</SText>
            </SView>
            <SHr />
            <SView col={'xs-12'} row center>
              <SText bold fontSize={16} color={STheme.color.link} underLine onPress={() => {
                // http://localhost:3000/reportes/ventas_por_evento_detalle?fecha_fin=2024-05-31&fecha_inicio=2024-05-01&key_evento=4040028a-12d6-4f01-868c-72b3d67c9a80
                SNavigation.navigate("/reportes/visitas_por_evento", {
                  key_evento: this.key
                })
              }}>{"REPORTE DE VISITAS"}</SText>
            </SView>
            <SHr />
            <SView col={'xs-12'} row center>
              <SText bold fontSize={16} color={STheme.color.link} underLine onPress={() => {
                // http://localhost:3000/reportes/ventas_por_evento_detalle?fecha_fin=2024-05-31&fecha_inicio=2024-05-01&key_evento=4040028a-12d6-4f01-868c-72b3d67c9a80
                SNavigation.navigate("/reportes/mesas_por_evento", {
                  key_evento: this.key
                })
              }}>{"REPORTE DE MESAS"}</SText>
            </SView>
            <SHr height={25} />
            <SView col={'xs-12'} height={5} style={{ backgroundColor: STheme.color.card }} />
            <SHr height={25} />
            {this.getActividades()}
            <SHr height={25} />
            <SView col={'xs-12'} height={5} style={{ backgroundColor: STheme.color.card }} />
            <SHr height={25} />
            {this.getEntradas()}
            <SHr height={25} />
            <SView col={'xs-12'} height={5} style={{ backgroundColor: STheme.color.card }} />
            <SHr height={25} />
            {this.getSector()}
            <SHr height={25} />
            <SView col={'xs-12'} height={5} style={{ backgroundColor: STheme.color.card }} />
            <SHr height={25} />
            {this.getPlanimetria()}
            <SView col={'xs-12'} height={5} style={{ backgroundColor: STheme.color.card }} />
            <SHr height={25} />
            {this.getFormEntrada()}

            <SHr height={25} />
          </SView>
        </>
      )
    }
  }

  listaEntradas() {
    const data = TipoEntrada.Actions.getByKeyEvento(this.key, this.props);
    if (!data) return <SLoad />;
    if (Object.keys(data).length === 0) return <SText fontSize={16} height={50} >Sin registros...</SText>;
    return Object.keys(data).map((key, index) => {
      var obj = data[key];

      return (
        <>
          <SView col={'xs-12'} row center >
            <SView col={'xs-12'} row center>
              <SView col={'xs-3'} style={{ alignItems: 'flex-end' }}>
                <SText fontSize={15}>{obj.descripcion}</SText>
              </SView>
              <SView col={'xs-3'} center>
                <SText fontSize={15}>----</SText>
              </SView>
              <SView col={'xs-3.5'} >
                <SText>{obj.precio} Bs.</SText>
              </SView>
            </SView>
            {/* <SText>Disponibles {obj.cantidad}</SText> */}
            <SHr height={15} />
          </SView>
        </>
      );
    });
  }

  getEntradas() {
    return (
      <>
        <SView col={'xs-12'} center row>
          <SText fontSize={25}>Sector Entradas</SText>
          <SHr height={25} />
          {this.listaEntradas()}
          <SHr height={5} />
          <SView col={'xs-11'} row center>
            <SView col={'xs-9'}></SView>
            <SView col={'xs-10 sm-3 md-3 lg-3 xl-3'} >
              <SView
                center
                style={{
                  borderRadius: 10,
                }}
                onPress={() => {
                  SNavigation.navigate('admin/tipo_entrada', { key: this.key });
                }}
                backgroundColor={'#833AB4'}
                height={40}
              >
                <SText fontSize={14}>AÑADIR</SText>
              </SView>
            </SView>
          </SView>
        </SView>
      </>
    )
  }

  getFormEntrada() {
    return (
      <>
        <SForm
          center
          row
          ref={(form) => {
            this.form = form;
          }}
          inputProps={{
            customStyle: 'romeo',
            separation: 16,

            color: STheme.color.text
            // fontSize: 16,
            // font: "Roboto",
          }}
          inputs={{
            foto_p: {
              type: 'image',
              isRequired: false,
              defaultValue: `${SSocket.api.root}evento/${this.key}_entrada?time=${new Date().getTime()}`,
              col: 'xs-4 sm-3.5 md-3 lg-2.5 xl-2.5',
              style: {
                borderRadius: 8,
                overflow: 'hidden',
                width: 130,
                height: 130,
                borderWidth: 0
              }
            }
          }}
          // onSubmitName={"Registrar"}
          onSubmit={(values) => {
            this.form.uploadFiles(
              SSocket.api.root + 'upload/' + evento.component + '/' + this.key + '_entrada'
            );
            SNavigation.goBack();
          }
          }

        />
        <SHr height={5} />
        <SView col={'xs-11'} row center>
          <SView col={'xs-9'}></SView>
          <SView col={'xs-10 sm-3 md-3 lg-3 xl-3'} >
            <SView
              center
              style={{
                borderRadius: 10,
              }}
              onPress={() => {
                this.form.submit()
              }}
              backgroundColor={'#833AB4'}
              height={40}
            >
              <SText fontSize={14}>Actualizar</SText>
            </SView>
          </SView>
        </SView>
      </>
    )
  }

  getEntradasBanner() {
    return (
      <>
        <SView col={'xs-12'} center row>
          <SText fontSize={25}>Baner de la entrada</SText>
          <SHr height={25} />
          <SView col={"xs-12"} center >
            <SView col={"xs-12 sm-10 md-8 lg-6 xl-4 xxl-3"} center >
              <SView col={"xs-12"} height={this.state.height}
                onLayout={e => {
                  const { width, height } = e.nativeEvent.layout
                  const scale = width / ImageSize.width;

                  this.setState({ width: ImageSize.width * scale, height: ImageSize.height * scale, scale: scale })
                }} center>
                <SImage src={require("../../../../../Assets/images/test.jpeg")} />
                <SView style={{
                  top: 718 * this.state.scale,
                  position: "absolute",
                  backgroundColor: "#FFF",
                  width: 545 * this.state.scale,
                  height: 84 * this.state.scale,
                  borderRadius: 14 * this.state.scale,
                  borderWidth: 3 * this.state.scale,
                  borderColor: "#000"
                }} center>
                  <SText color={"#000"} fontSize={30 * this.state.scale} center bold>{this.state.nombre}</SText>
                </SView>
                <SView style={{
                  top: 855 * this.state.scale,
                  position: "absolute",
                  backgroundColor: "#000",
                  opacity: "0.85",
                  width: 270 * this.state.scale,
                  height: 270 * this.state.scale,
                  borderRadius: 14 * this.state.scale,
                  borderWidth: 3 * this.state.scale,
                  borderColor: "#000",
                  overflow: 'hidden',
                }} center >
                  {!this.state.showQr ? <SIcon name="Logo" fill={STheme.color.primary} style={{
                    width: "50%", height: "50%",
                  }} /> : <EntradaQR key_entrada={this.key_entrada} col={"xs-12"} style={{
                    padding: 12 * this.state.scale
                  }} />}

                </SView>
              </SView>
            </SView>
          </SView>



        </SView>
      </>
    )
  }

  listaSectores() {
    const data = Sector.Actions.getByKeyEvento(this.key, this.props);
    if (!data) return <SLoad />;
    if (Object.keys(data).length === 0) return <SText fontSize={16} height={50}>Sin registros...</SText>;
    return Object.keys(data).map((key, index) => {
      var obj = data[key];

      return (
        <>
          <SView col={'xs-12'} row center >
            <SView col={'xs-12'} row center>
              <SView col={'xs-3'} style={{ alignItems: 'flex-end' }}>
                <SText fontSize={15}>{obj.descripcion}</SText>
              </SView>
              <SView col={'xs-3'} center>
                <SText fontSize={15}>----</SText>
              </SView>
              <SView col={'xs-3.5'} >
                <SText>{obj.precio} Bs.</SText>
              </SView>
            </SView>
            {/* <SText>Disponibles {obj.cantidad}</SText> */}
            <SHr height={15} />
          </SView>
        </>
      );
    });
  }


  getSector() {
    return (
      <>
        <SView col={'xs-12'} center row>
          <SText fontSize={25}>Sector Mesas</SText>
          <SHr height={25} />
          {this.listaSectores()}
          <SHr height={5} />
          <SView col={'xs-11'} row center>
            <SView col={'xs-9'}></SView>
            <SView col={'xs-10 sm-3 md-3 lg-3 xl-3'} >
              <SView
                center
                style={{
                  borderRadius: 10,
                }}
                onPress={() => {
                  SNavigation.navigate('admin/sector', { key: this.key });
                }}
                backgroundColor={'#DB562D'}
                height={40}
              >
                <SText fontSize={14}>AÑADIR</SText>
              </SView>
            </SView>
          </SView>
        </SView>
      </>
    )
  }

  getPlanimetria() {
    return (
      <>
        <SView col={'xs-12'} center row>
          <SText fontSize={25}>Planimetría</SText>
          <SHr height={25} />
          {/* {this.listaSectores()} */}
          <SHr height={5} />
          <SView col={'xs-11'} row center>
            <SView col={'xs-9'}></SView>
            <SView col={'xs-10 sm-3 md-3 lg-3 xl-3'} >
              <SView
                center
                style={{
                  borderRadius: 10,
                }}
                onPress={() => {
                  SNavigation.navigate('planimetria', { key_evento: this.key });
                }}
                backgroundColor={'#128C7E'}
                height={40}
              >
                <SText fontSize={14}>EDITAR</SText>
              </SView>
            </SView>
          </SView>
        </SView>
      </>
    )
  }

  render() {
    return (
      <>
        <SPage title={'Lista'} onRefresh={e => {
          if (e) e();
          evento.Actions._getReducer(this.props).data = null
          actividad.Actions._getReducer(this.props).data = null
          sector.Actions._getReducer(this.props).data = null
          tipo_entrada.Actions._getReducer(this.props).data = null
          this.setState({ ...this.state })
        }}>
          <SView col={'xs-12 '} center>
            <SView col={'xs-10 sm-10 md-10 lg-8 xl-6'} center row>
              {this.getDataEvento()}
              <SText onPress={() => {
                SNavigation.navigate("/staff", { key_evento: this.key })
              }}>{"STAFF"}</SText>
            </SView>
          </SView>
          <SHr height={30} />
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Perfil);
