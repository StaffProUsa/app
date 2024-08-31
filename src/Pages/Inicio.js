import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList, ScrollView } from 'react-native';
import { SForm, SHr, SIcon, SLoad, SPage, SText, STheme, SView, SLanguage, SNavigation } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import EventoItem from '../Components/Evento/EventoItem';
import TipoItem from '../Components/Staff/TipoItem';
import { Container } from '../Components';
import PBarraFooter from '../Components/PBarraFooter';
import Carrito from '../Components/Carrito';
import Actions from '../Actions';
import Model from '../Model';

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

  render() {
    // if (this.state.dataTipo) return <SLoad />
    const arr = this.state.dataTipo ?? [];
    const space = 15;
    // console.log("DATA")
    // console.log(this.state.dataTipo)
    // console.log(this.state.data)

    return <SPage titleLanguage={{ es: "Próximos eventos", en: "Next events" }} preventBack footer={<PBarraFooter url={'/'} />} disableScroll>
      <Container flex>
        <FlatList
          style={{
            width: "100%"
          }}
          contentContainerStyle={{
            width: "100%",
            // alignItems: "center"
          }}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
          }
          ListHeaderComponent={() => <SView col={"xs-12"}>
            <SHr h={10} />
            {this.getForm()}
            <SHr h={15} />

            <ScrollView style={{ width: "100%" }} horizontal>
              <FlatList
                contentContainerStyle={{
                  width: "100%",
                  height: 100,
                  // alignItems: "center"
                }}
                // refreshControl={
                //   <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
                // }
                data={arr}
                horizontal
                showsHorizontalScrollIndicator={true}
                scrollEnabled={false}
                ListHeaderComponent={() => <SView width={space} />}
                ItemSeparatorComponent={() => <SView width={space} />}
                ListFooterComponent={() => <SView width={space} />}
                // keyExtractor={item => item.key.toString()}
                keyExtractor={item => item.key ? item.key.toString() : String(index)}
                onEndReachedThreshold={0.3}
                renderItem={({ item, index }) => {
                  if (!item) return null;

                  if (item.key == "ADD") {
                    return <SView width={70} height={70} center card
                      onPress={() => {
                        SNavigation.navigate("/registro/categorias")
                      }}>
                      <SText>ADD</SText>
                    </SView>
                  }
                  // console.log("ITEM")
                  // console.log(item)
                  return <TipoItem ref={(ref) => this.ref[item?.key] = ref} key={item?.key.toString()} data={item} />
                  // return <SText>{item.descripcion} ggg</SText>
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
        {/* <Carrito
        style={{
          bottom: '25%'
        }}
      /> */}
      </Container>
    </SPage>
  }
}

