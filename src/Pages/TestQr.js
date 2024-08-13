import React from 'react';
import { connect } from 'react-redux';
// import SkeletonContent from 'react-native-skeleton-content';

import { SHr, SImage, SLoad, SNavigation, SPage, SText, SView } from 'servisofts-component';
import LoginGoogle from '../LoginApis/LoginGoogle';
import { Container } from '../Components';
import SSocket from 'servisofts-socket';

class TestQr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {

    SSocket.sendPromise({
      service: "sqr",
      component: "qr",
      type: "registro",
      estado: "cargando",
      data: {
        content: "https://casagrande.servisofts.com/venta?key=",
        content_type: "text",
        errorCorrectionLevel: "L",
        colorBackground: "#ffffff",
        type_color: "solid",
        colorBody: "#000000",
        body: "Dot",
        framework: "Rounded",
        header: "Circle",
        detail: "Default"
      }
    }).then(e => {
      this.setState({ dataQr: e.data })
    }).catch(e => {
      console.error(e);
    })

    // const data = {
    //   "component": "qr",
    //   "type": "registro",
    //   "estado": "cargando",
    //   "data": {
    //     "content": "http://servisofts.com",
    //     "content_type": "text",
    //     "errorCorrectionLevel": "L",
    //     "colorBackground": "#ffffff",
    //     "type_color": "solid",
    //     "colorBody": "#000000",
    //     "body": "Dot",
    //     "framework": "Rounded",
    //     "header": "Circle",
    //     "detail": "Default"
    //   },
    // }

  }

  getQr() {
    if (!this.state?.dataQr) return null
    console.log(this.state.dataQr)
    return "data:image/png;base64,"+ this.state.dataQr?.b64
  }


  render() {
    return (
      <SPage   >
        <Container >
          <SHr />
          <SText>QR</SText>
          <SHr />
          <SView width={200} height={200} center>
            <SHr />
            <SImage src={`${this.getQr()}`} width={"100%"} height={"100%"} enablePreview />
            <SHr />
          </SView>
        </Container>
      </SPage>
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(TestQr);
