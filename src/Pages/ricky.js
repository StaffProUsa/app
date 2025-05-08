import React, { Component } from 'react';
import { SHr, SList, SLoad, SText, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';

export default class ricky extends Component {

  state = {
    data: null
  }

  componentDidMount() {

    SSocket.sendPromise({
      component: "company",
      type: "getAll"
    }).then((resp) => {
      // this.state.data = resp.data;
      // this.forceUpdate();
      this.setState({ data: resp.data });
    }).catch((e) => {
      console.log("error", e);
    });
  }
  render() {
    if (!this.state.data) {
      return <SLoad />
    }
    return <SView>
      {Object.values(this.state.data).map((item, index) => {
        return <>
          <SText card padding={8} border onPress={()=>{
            item.open = !item.open;
            this.forceUpdate();
          }}>{item.descripcion}</SText>
          {item.open && <SText>{JSON.stringify(item)}</SText>}
        </>
      })}
    </SView>
  }
}
