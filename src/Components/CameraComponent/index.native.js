import React, { useEffect, useState } from 'react'
import { View, Alert, StyleSheet } from 'react-native'


import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera'
import { BarcodeFormat, useScanBarcodes, scanBarcodes } from 'vision-camera-code-scanner'
import { runOnJS } from 'react-native-reanimated'
import CuadradoEnfoque from './CuadradoEnfoque'
import { SLoad, SNavigation, SThread } from 'servisofts-component'

const CameraComponent = () => {
  const [loading, setLoading] = useState(false)
  const devices = useCameraDevices()
  const device = devices.back

  const [hasPermission, setHasPermission] = useState(false)
  const [barcodes, setBarcodes] = useState()
  const [isActive, setisActive] = useState(false)

  const readQR = (o) => {
    if (!o) return;
    if (!o[0]) return;
    if (!o[0].rawValue) return;
    const value = o[0].rawValue;
    setisActive(false)
    SNavigation.goBack();
    new SThread(50, "asdsa").start(() => {
      SNavigation.openDeepLink(value);
    })
    // console.log(o[0])
  }
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true })
    runOnJS(readQR)(detectedBarcodes)
  }, [])


  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'authorized')
    })()

    setisActive(true)
  }, [])

  // if(!isActive) setisActive(true)
  // useEffect(() => {
  //   if (barcodes && barcodes.length) {

  //     console.log('barcodes', barcodes);
  //   }
  // }, [barcodes])

  return (
    <View style={{
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {device != null && hasPermission ? (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            isActive={isActive}
            device={device}
            frameProcessor={frameProcessor}
            frameProcessorFps={1}


          />
        </>
      ) : <SLoad />}
      <CuadradoEnfoque />
    </View>
  )
}

export default CameraComponent