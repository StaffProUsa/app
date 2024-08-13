import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList } from 'react-native';
import { SHr, SLoad, SPage, SText } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import EventoItem from '../Components/Evento/EventoItem';
import { Container } from '../Components';
import PBarraFooter from '../Components/PBarraFooter';
import Carrito from '../Components/Carrito';

const CANTIDAD_X_PAGE = 4;
export default class Inicio extends Component {
  ref = {}
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      page: 0,
      endData: false,
      data: []
    };

  }

  componentDidMount() {
    this.requestData();
  }


  requestData() {
    SSocket.sendPromise({
      component: "evento",
      type: "getInicio",
      limit: CANTIDAD_X_PAGE,
      offset: this.state.page * CANTIDAD_X_PAGE
    }).then(e => {
      if (e.data.length <= 0) {
        this.state.endData = true;
      }
      this.state.data = [...this.state.data, ...e.data]
      this.setState({ data: this.state.data, refreshing: false })
    }).catch(e => {
      this.setState({ refreshing: false })
    })
  }
  onEndReached() {
    if (this.state.data.length <= 0) return;
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
    this.state.endData = false;
    this.setState({ data: [], refreshing: true })
    this.requestData();
  };
  render() {
    return <SPage title={"Próximos eventos"} preventBack disableScroll footer={<PBarraFooter url={'/'} />}>
      <FlatList
        contentContainerStyle={{
          width: "100%",
          // alignItems: "center"
        }}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
        }
        data={this.state.data}
        keyExtractor={item => item.key.toString()}
        onEndReachedThreshold={0.3}
        viewabilityConfig={{ minimumViewTime: 700, itemVisiblePercentThreshold: 75 }}
        onViewableItemsChanged={this.onViewableItemsChanged}
        onEndReached={this.onEndReached.bind(this)}
        ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
        ListFooterComponent={this.renderItemFooter.bind(this)}
        renderItem={({ item, index }) => {
          return <EventoItem ref={(ref) => this.ref[item.key] = ref} key={item.key} data={item} />
        }}
      />
      <Carrito
        style={{
          bottom: '25%'
        }}
      />
    </SPage>
  }
}

