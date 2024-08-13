import React, { useRef } from "react";
import { Animated, PermissionsAndroid, Platform, StyleSheet, Text, View } from "react-native";
import { Camera, getCameraDevice } from "react-native-vision-camera";
import { SIcon, SImage, SNavigation, SPage, SPopup, SText, STheme, SThread, SView } from "servisofts-component";
import CuadradoEnfoque from "./CuadradoEnfoque";
import { PERMISSIONS } from "react-native-permissions";

class CameraComponent extends React.Component {

  constructor(props) {
    super(props)


    this.state = {
      isActive: true
    }
  }

  componentDidMount() {
    this.state.qr = null;

    const init = async () => {
      let permiso = false;
      // if (Platform.OS === 'android') {
      //   permiso = await PermissionsAndroid.request(PERMISSIONS.ANDROID.CAMERA)
      //   this.setState({ ...this.state, permiso })

      // }
    };

    init()
  }



  codeScanner = {
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (codes) {
        const code1 = codes[0];
        SNavigation.openDeepLink(code1.value);
      }
      // console.log(codes)
      // console.log(`Scanned ${codes.length} codes!`)
    }
  }
  render() {
    const devices = Camera.getAvailableCameraDevices()
    const device = getCameraDevice(devices, 'back')
    if (!this.state.permiso) return <SText center>{"Solicitando permisos de camara"}</SText>
    if (device == null) return <SText center>{"No device error"}</SText>

    return (
      <SView col={"xs-12"} height >
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={this.state.isActive}
          onError={e => {
            console.log(e);
          }}
          codeScanner={this.codeScanner}
        // onInitialized={() => { setShowCamera() }}
        />
        <CuadradoEnfoque />
        {/* <SView><SText>Hola mundo</SText></SView> */}
      </SView>

    );
  }




}
export default CameraComponent