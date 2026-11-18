import { SStorage } from "servisofts-component";
import SSocket from "servisofts-socket";

export default class DeviceKey {
    static _STORAGE_KEY = "firebaseDeviceKey";

    static KEY = "null";

    static init = () => {
        DeviceKey._loadKey()
    }
    static getKey = () => {
        return DeviceKey.KEY;
    }
    static setKey = (key) => {
        if (!key) return;
        if (key != DeviceKey.KEY) {
            DeviceKey.KEY = key;
            DeviceKey._saveKey();
        }
        // El socket pudo identificarse antes de tener el token: re-identificar para que el servidor lo registre
        SSocket.identificarse().catch(e => console.log("DeviceKey: no se pudo re-identificar", e));
    }

    static _loadKey = () => {
        SStorage.getItem(DeviceKey._STORAGE_KEY, (data) => {
            // No pisar un token nuevo que llegó antes que la lectura del storage
            if (DeviceKey.KEY == "null" && data) DeviceKey.KEY = data;
        })
    }
    static _saveKey = () => {
        SStorage.setItem(DeviceKey._STORAGE_KEY, DeviceKey.KEY);
    }
}
