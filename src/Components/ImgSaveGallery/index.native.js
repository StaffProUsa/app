import React from 'react';
import { PermissionsAndroid, Platform } from "react-native";
// import fetch_blob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
// import CameraRoll from "@react-native-community/cameraroll";

class ImgSaveGallery {
  static async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  static async guardar(qr) {
    let spliteoBase64 = qr.split(',')[1];

    if (Platform.OS === "android" && !(await ImgSaveGallery.hasAndroidPermission())) {
      console.log("Denied");
      alert("No se puede guardar la imagen");
      return;
    }



    var file_path = ""

    if (Platform.OS === "ios") {
      file_path = RNFS.DocumentDirectoryPath + "/casagrande_pago.jpg"
    } else {
      // const dirs = fetch_blob.fs.dirs;
      const dirs = ""
      // fetch_blob.fs.createFile();
      file_path = dirs.DCIMDir + "/Camera/casagrande_pago.jpg"
    }


    // const file_path = `${RNFS.DocumentDirectoryPath}/${new Date().toISOString()}.png`.replace(/:/g, '-');


    RNFS.writeFile(file_path, spliteoBase64, 'base64').then((resp) => {
      console.log("guardado", file_path);
      // CameraRoll.saveImageWithTag(file_path);
      alert("guardado exitoso");
    })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };
}
export default ImgSaveGallery;

