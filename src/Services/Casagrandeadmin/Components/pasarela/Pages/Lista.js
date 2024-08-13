import React from 'react';
import { connect } from 'react-redux';
import {
  SIcon,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  STable2,
  STheme,
  SView,
  SImage,
  SDate,
  SText
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
class Lista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: false
    };
    this.key = SNavigation.getParam('key');
  }
  componentDidMount() {
    this.setState({ loading: true })
    SSocket.sendPromise({
      component: "pasarela",
      type: "getAll",
      estado: "cargando",

    }, 1000).then((resp) => {
      this.setState({ loading: false, data: resp?.data })
    }).catch(e => {
      this.setState({ loading: false })

    })
  }

  getTable() {
    const { loading, data } = this.state;
    if (loading) return <SLoad />
    if (!data) return <SText>No hay data</SText>
    return (
      <STable2
        headerColor={STheme.color.info}
        header={[
          { key: 'index', label: '#', width: 50 },
          { key: "key", label: "key", width: 100 },
          { key: "checkout_amount", label: "checkout_amount", width: 100 },
          { key: "checkout_currency", label: "checkout_currency", width: 100 },
          { key: "type", label: "type", width: 100 },
          { key: "fecha_on", label: "fecha_on", width: 100 },
          { key: "key_usuario", label: "key_usuario", width: 100 },
        ]}
        data={data}
      />
    );
  }

  render() {
    return (
      <SPage title={'Lista'} disableScroll>
        <SView col={'xs-12'} center height>
          {this.getTable()}
        </SView>
      </SPage>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Lista);
