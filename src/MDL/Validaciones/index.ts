import SSocket from "servisofts-socket";
import MDLAbstract from "../MDLAbstract";
import { EventListener } from "./type";
import { Platform } from "react-native";
import { SNavigation } from "servisofts-component";
import packageInfo from "../../../package.json";


export default class validaciones extends MDLAbstract<EventListener> {



    async componentDidMount() {
        try {
            await this.validateVersion();
        } catch (e) {
            console.error(e)
        }
    }




    validateVersion = async () => {
        return new Promise((resolve, reject) => {
            SSocket.sendPromise({
                component: "enviroment",
                type: "getByKey",
                key: "version_" + Platform.OS
            }).then((e: any) => {
                if (!!e.data) {
                    const versionRequired = e.data?.data
                    if (versionToNumber(versionRequired) > versionToNumber(packageInfo.version)) {
                        SNavigation.replace("/version_required")
                        reject("Version not compatible")
                        return;
                    }
                }
                resolve(true)
            }).catch(e => {
                resolve(true) // Sin me da error el server igual lo dejo pasar
                console.error(e)
            })
        })
    }

    


}


//  ------- -EXTRAS -- ----------
const versionToNumber = (v) => {
    const array = v.split("\.");
    const vl = 100;
    let vn = 0;
    for (let i = 0; i < array.length; i++) {
        const element = array[array.length - i - 1];
        const vp = Math.pow(vl, i);
        vn += (vp * element)
    }
    console.log(vn)
    return vn;
}