import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList, ScrollView } from 'react-native';
import { SForm, SHr, SIcon, SLoad, SPage, SText, STheme, SView, SLanguage, SNavigation, SGradient } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import EventoItem from '../Components/Evento/EventoItem';
import TipoItem from '../Components/Staff/TipoItem';
import { Container } from '../Components';
import PBarraFooter from '../Components/PBarraFooter';
import Carrito from '../Components/Carrito';
import Actions from '../Actions';
import Model from '../Model';
import Calendar from '../Components/Calendar';

const CANTIDAD_X_PAGE = 4;

export default class Inicio extends Component {
  static INSTANCE: Inicio;
  ref = {}
  constructor(props) {
    super(props);
    Inicio.INSTANCE = this;
    this.state = {
      refreshing: false,
      page: 0,
      endData: false,
      data: [],
      dataTipo: []
    };

  }

  componentDidMount() {
    // Actions.usuario_company.getAllCompanyUser().then(e => {

    // }).catch(e => {

    // })

    SSocket.sendPromise({
      component: "staff_usuario",
      type: "getInvitacionesPendientes",
      key_usuario: Model.usuario.Action.getKey()
    }).then(e => {
      this.setState({ invitaciones: e.data })
    }).catch(e => {
      console.error(e);
    })

    this.state.data = []
    this.state.page = 0;
    this.state.endData = false;
    this.getFiltros();
    this.requestData();
  }
  onChangeFavorito() {
    this.componentDidMount();
  }
  getFiltros() {
    SSocket.sendPromise({
      component: "evento",
      type: "getInicioFiltros",
      key_usuario: Model.usuario.Action.getKey()
    }).then(e => {
      let listTypes = [];
      Object.values(e.data).map((company) => {
        listTypes = [...listTypes, ...company.staff_tipos]
      })

      const favs = Object.values(e.favoritos);
      listTypes = listTypes.filter(a => favs.find(b => b.key_staff_tipo == a.key))

      this.setState({ dataTipo: [{ key: "ADD" }, ...listTypes], refreshing: false })
      console.log(e);
    }).catch(e => {
      console.error(e);
    })
  }

  requestData() {
    SSocket.sendPromise({
      component: "evento",
      type: "getInicio",
      limit: CANTIDAD_X_PAGE,
      offset: this.state.page * CANTIDAD_X_PAGE,
      key_usuario: Model.usuario.Action.getKey(),
    }).then(e => {
      if (e.data.length <= 0) {
        this.state.endData = true;
      }
      this.state.data = [...this.state.data, ...e.data]


      this.setState({ data: this.state.data, refreshing: false })
    }).catch(e => {
      this.setState({ refreshing: false })
    })

    // SSocket.sendPromise({
    //   component: "staff_tipo",
    //   type: "getAll",
    // }).then(e => {
    //   // if (e.data.length <= 0) {
    //   //   this.state.endData = true;
    //   // }
    //   // this.state.dataTipo = [...this.state.dataTipo, ...e.data]
    //   this.setState({ dataTipo: Object.values(e.data), refreshing: false })
    // }).catch(e => {
    //   // this.setState({ refreshing: false })
    // })

  }
  onEndReached() {
    console.log("ENTRO EN EL ONDEND")
    // if (this.state.data.length <= 0) return;
    // if (this.state.dataTipo.length <= 0) return;
    if (this.state.endData) return;
    this.state.page += 1;
    this.requestData();
  }
  renderItemFooter() {
    if (this.state.endData) return <SHr h={100} />;
    return <>
      <SHr h={50} />
      <SLoad />
      <SHr h={100} />
    </>
  }


  onViewableItemsChanged = ({ viewableItems, changed }) => {
    changed.forEach(item => {
      if (!this.ref[item.key]) return;
      if (!item.isViewable) {
        if (this.ref[item.key].onViewOut) {
          this.ref[item.key].onViewOut()
        }
      } else {
        if (this.ref[item.key].onViewIn) {
          this.ref[item.key].onViewIn()
        }
      }
    });
  }

  handleRefresh = async () => {
    this.state.page = 0;
    this.state.data = [];
    this.state.dataTipo = {};
    this.state.endData = false;
    this.setState({ data: [], refreshing: true })
    this.setState({ dataTipo: [], refreshing: true })
    this.requestData();
  };

  getForm() {
    return <SForm
      ref={(ref) => { this.form = ref; }}
      row
      style={{
        justifyContent: "space-between",
      }}
      inputProps={{
        col: "xs-12",
      }}
      inputs={{
        Codigo: {
          placeholder: "Search", type: "text", isRequired: true, icon: (
            <SIcon
              name={'lupa'}
              fill={STheme.color.primary}
              width={17}
              height={20}
            />
          )
        },
      }}
      error={this.state.error}

      onSubmit={(values) => {
        Model.usuario.Action.verificarCodigoPass({ codigo: values.Codigo }).then(resp => {
          var usr_rec = resp.data;
          SNavigation.navigate("/login/recuperar_pass", usr_rec);
        }).catch(e => {
          console.error(e);
          if (e?.error == "error_datos") {
            this.setState({ loading: false, error: "Código erróneo, verifique nuevamente." })
          } else {
            this.setState({ loading: false, error: "Ha ocurrido un error al introducir el código." })
          }
        })
      }}
    />
  }

  renderInvitaciones() {
    if (!this.state.invitaciones) return null
    let txtInvitacion = "";
    let txtInvitacion_en = "";
    if (this.state.invitaciones.length == 1) {
      txtInvitacion = "Tienes 1 invitación pendiente",
        txtInvitacion_en = "You have 1 pending invitation"
    } else {
      txtInvitacion = `Tienes ${this.state.invitaciones.length} invitaciones pendientes`,
        txtInvitacion_en = `You have ${this.state.invitaciones.length} pending invitations`
    }

    return <>
      <SView col={"xs-12"} padding={15} row
        style={{
          backgroundColor: "#F1C666",
          borderRadius: 14,
          borderLeftWidth: 4,
          borderLeftColor: "#DE7B26",


        }}>
        <SView col={"xs-2"} row center padding={5}>
          <SIcon name={"exclamacion2"} fill={"#DE7B26"} width={35} height={35} />
        </SView>
        <SView col={"xs-7"}  >
          <SText fontSize={16} bold color={"#585858"} language={{
            es: "AVISO IMPORTANTE",
            en: "IMPORTANT NOTICE"
          }} />
          <SText color={"#585858"} onPress={() => {
            // SNavigation.navigate("/invitations")
          }} language={{
            es: txtInvitacion,
            en: txtInvitacion_en
          }} />
        </SView>

        <SView col={"xs-3"} row center>
          <SView col={"xs-12"} row center padding={10} backgroundColor={"#585858"} onPress={() => {
            SNavigation.navigate("/invitations")
          }}
            style={{ borderRadius: 6 }}>
            <SText language={{
              es: "VER",
              en: "SEE"
            }} />
          </SView>
        </SView>
      </SView>


    </>
  }

  render() {
    // if (this.state.dataTipo) return <SLoad />
    const arr = this.state.dataTipo ?? [];
    const space = 15;
    // console.log("DATATIPO")
    // console.log(this.state.dataTipo)
    // console.log(this.state.data)
    console.log("dataTipo")
    console.log(this.state.dataTipo)
    console.log("data")
    console.log(this.state.data)
    console.log("invitaciones")
    console.log(this.state.invitaciones)
    if ((this.state.dataTipo.length == 1) && (this.state.data.length == 0) && (this.state.invitaciones == 0)) return <SPage titleLanguage={{ es: "Próximos eventos", en: "Next events" }} center preventBack footer={<PBarraFooter url={'/'} />} disableScroll>
      <SView col={'xs-12'} center>
        <Container>
          <SView col={'xs-12'} center
            style={{
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: STheme.color.darkGray,
              overflow: 'hidden',
            }}>
            <SGradient colors={["#0C0C10", "#040405"]} style={{ borderRadius: 16, }} />
            <SHr height={25} />
            <SText fontSize={28} center language={{
              es: "Lo sentimos, actualmente no hay información disponible",
              en: "Sorry, there is currently no information available"
            }} />
            <SHr height={35} />
            <SView width={140} height={140} center style={{
              borderRadius: 130,
              backgroundColor: STheme.color.white,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: STheme.color.primary,
            }}>
              <SIcon name={'noevent'} fill={STheme.color.primary} height={80} />
            </SView>
            <SHr height={35} />
            <SText fontSize={20} center language={{
              es: "No estás asignado(a) a ninguna empresa o no formas parte de una. Por favor, contacta al administrador para más detalles",
              en: "You are not assigned to any company or you are not part of one. Please contact the administrator for more details"
            }} />
            <SHr height={25} />
          </SView>
        </Container>
        <SHr height={50} />
      </SView>
    </SPage>

    return <SPage titleLanguage={{ es: "Próximos eventos", en: "Next events" }} preventBack footer={<PBarraFooter url={'/'} />} >
      <Container>
        <SView col={"xs-12"}>
          <SHr h={10} />
          {this.state.invitaciones && this.state.invitaciones.length > 0 && this.renderInvitaciones()}
          <SHr h={10} />
          {/* {this.getForm()}
          <SHr h={15} /> */}

          {/* <ScrollView style={{ width: "100%" }} horizontal>
            <FlatList
              contentContainerStyle={{
                width: "100%",
                height: 100,
              }}
              data={arr}
              horizontal
              showsHorizontalScrollIndicator={true}
              scrollEnabled={true}
              ListHeaderComponent={() => <SView width={space} />}
              ItemSeparatorComponent={() => <SView width={space} />}
              ListFooterComponent={() => <SView width={space} />}
              keyExtractor={item => item.key ? item.key.toString() : String(index)}
              onEndReachedThreshold={0.3}
              renderItem={({ item, index }) => {
                if (!item) return null;
                if (item.key == "ADD") {
                  return <SView width={70} height={70} center card
                    onPress={() => {
                      SNavigation.navigate("/registro/categorias")
                    }}>
                    <SText language={{
                      es: "AGREGAR",
                      en: "ADD"
                    }} />
                  </SView>
                }
                return <TipoItem ref={(ref) => this.ref[item?.key] = ref} key={item?.key.toString()} data={item} />
              }}
            />
          </ScrollView> */}
          {/* <SHr h={10} />
          <SView col={"xs-11"} justify>
            <SText fontSize={20} bold language={{
              es: "Tus eventos",
              en: "Your events"
            }} />
          </SView> */}
          <SHr h={15} />
        </SView>
        <Calendar eventos = {this.state.data} />
      </Container>


      {/* <Container flex>
        <FlatList
          style={{
            width: "100%"
          }}
          contentContainerStyle={{
            width: "100%",
          }}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
          }
          ListHeaderComponent={() => <SView col={"xs-12"}>
            <SHr h={10} />
            {this.state.invitaciones && this.state.invitaciones.length > 0 && this.renderInvitaciones()}
            <SHr h={10} />
            {this.getForm()}
            <SHr h={15} />

            <ScrollView style={{ width: "100%" }} horizontal>
              <FlatList
                contentContainerStyle={{
                  width: "100%",
                  height: 100,
                }}
                data={arr}
                horizontal
                showsHorizontalScrollIndicator={true}
                scrollEnabled={true}
                ListHeaderComponent={() => <SView width={space} />}
                ItemSeparatorComponent={() => <SView width={space} />}
                ListFooterComponent={() => <SView width={space} />}
                keyExtractor={item => item.key ? item.key.toString() : String(index)}
                onEndReachedThreshold={0.3}
                renderItem={({ item, index }) => {
                  if (!item) return null;
                  if (item.key == "ADD") {
                    return <SView width={70} height={70} center card
                      onPress={() => {
                        SNavigation.navigate("/registro/categorias")
                      }}>
                      <SText language={{
                        es: "AGREGAR",
                        en: "ADD"
                      }} />
                    </SView>
                  }
                  return <TipoItem ref={(ref) => this.ref[item?.key] = ref} key={item?.key.toString()} data={item} />
                }}
              />
            </ScrollView>
            <SHr h={10} />
            <SView col={"xs-11"} justify>
              <SText fontSize={20} bold language={{
                es: "Tus eventos",
                en: "Your events"
              }} />
            </SView>
            <SHr h={15} />
          </SView>}
          scrollEnabled={true}
          data={this.state.data}
          keyExtractor={item => item.key.toString()}
          onEndReachedThreshold={0.3}
          viewabilityConfig={{ minimumViewTime: 700, itemVisiblePercentThreshold: 75 }}
          onViewableItemsChanged={this.onViewableItemsChanged}
          onEndReached={this.onEndReached.bind(this)}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          ListFooterComponent={this.renderItemFooter.bind(this)}
          renderItem={({ item, index }) => {
            return <EventoItem ref={(ref) => this.ref[item.key] = ref} key={item.key} data={item} />
          }}
        />
      </Container> */}
    </SPage>
  }
}

