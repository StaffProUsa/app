import { Linking, Platform } from "react-native";
import FileViewer from 'react-native-file-viewer';
import FetchFunction from "./FetchFunction";
var RNFS = require("react-native-fs");
const delay = ms => new Promise(res => setTimeout(res, ms));

export default class SFetchBlob {

    constructor() {

    }
    descargar = async (props, callback) => {
        console.log("INICIANDO DESCARGA....");
        var arrUr = props.descripcion.split("/");
        var name = arrUr[arrUr.length - 1]
        var pathDirectori = "";
        if (Platform.OS == "android") {
            // pathDirectori = RNFS.ExternalDirectoryPath;
            pathDirectori = RNFS.DownloadDirectoryPath;
        } else {
            pathDirectori = RNFS.DocumentDirectoryPath;
        }
        var path = pathDirectori + '/Servisofts/Drive';
        var list = name.split(".");
        var extencion = list[list.length - 1];
        console.log(props)
        var name = "";
        if (props.tipo == 0) {
            extencion = "zip"
            name = props.descripcion + ".zip";
        } else {
            name = props.descripcion;
        }
        var urlImage = props.url + "." + extencion;
        console.log(urlImage)
        var toPath = path + "/" + name
        console.log(toPath);
        urlImage=urlImage+"?key_usuario="+props.key_usuario;
        await RNFS.mkdir(path, {}).catch((err) => {
            console.log("Asdasdsa");
            console.log(err)
        })
        var lastP = false;

        RNFS.downloadFile({
            fromUrl: urlImage,
            // headers: {
            //     // "Access-Control-Allow-Origin":"*",
            //     'key_usuario': props.key_usuario,
            // },
            toFile: toPath,
            begin: () => {
                console.log("begim");
                var resp = FetchFunction.progresFormat(1, 0);
            },
            progress: (evt) => {
                var resp = FetchFunction.progresFormat(evt.contentLength, evt.bytesWritten);
                if (lastP) {
                    var time = resp.time - lastP.time;
                    if (time > 250 || !lastP.velocity) {
                        var bytes = resp.received.byte - lastP.received.byte
                        var bxs = bytes / (time / 1000);
                        var timeInfo = FetchFunction.formatByte(bxs);
                        resp.velocity = timeInfo.val + "/s";
                        lastP = resp;
                    } else {
                        resp.velocity = lastP.velocity
                    }
                } else {
                    lastP = resp;
                    resp.velocity = 0;
                }
                callback(resp)
            },

        }).promise.then((r) => {
            console.log(r);
            // callback(0)
            FileViewer.open(toPath, { showOpenWithDialog: true })
                .then(() => {
                    // success
                })
                .catch(error => {
                    // error
                });
        })
    }
}