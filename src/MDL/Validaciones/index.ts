import SSocket from "servisofts-socket";
import MDLAbstract from "../MDLAbstract";
import { EventListener } from "./type";
import { Platform } from "react-native";
import { SNavigation, SNotification, STheme, SLanguage } from "servisofts-component";
import packageInfo from "../../../package.json";
import Model from "../../Model";


export default class validaciones extends MDLAbstract<EventListener> {



    async componentDidMount() {
        try {
            await this.validateVersion();
            await this.verificarImagen();
            await this.getStaffTipoFavorito();

        } catch (e: any) {
            SNotification.send({
                title: "Error",
                body: e,
                color: STheme.color.danger,
                time: 5000
            })
            console.error(e)
        }
    }




    validateVersion = () => {
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
                        reject(SLanguage.select({
                            en: "Version not compatible",
                            es: "Versión no compatible",
                        }))
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



    verificarImagen = async () => {
        const key_usuario = Model.usuario.Action.getKey();
        if (!key_usuario) {
            return;
        }
        try {
            const response = await fetch(`${SSocket.api.root}usuario/${key_usuario}`);

            if (!response.ok) {
                SNavigation.replace('/registro/foto', { key_usuario: key_usuario });
                // throw "Imagen no existe";
                throw SLanguage.select({
                    es: "Para continuar, por favor sube una foto de perfil.",
                    en: "To continue, please upload a profile picture.",
                })
            }
        } catch (error) {
            console.log('Error al verificar la imagen:', error);
            SNavigation.replace('/registro/foto', { key_usuario: key_usuario }); // Por si hay error de red también lo llevamos a subir foto
            throw SLanguage.select({
                es: "Para continuar, por favor sube una foto de perfil.",
                en: "To continue, please upload a profile picture.",
            })
        }
    };

    getStaffTipoFavorito() {
        return new Promise((resolve, reject) => {
            if (!Model.usuario.Action.getKey()) {
                resolve(true);
                return;
            }
            SSocket.sendPromise({
                component: "staff_tipo_favorito",
                type: "getAll",
                key_usuario: Model.usuario.Action.getKey()
            }).then((e: any) => {
                // this.setState({ StaffTipoFavorito: e.data })

                if (e.data && Object.keys(e.data).length === 0) {
                    SNavigation.navigate("/perfil/staff_tipo")
                    reject(SLanguage.select({
                        es: "Selecciona tus aptitudes o lo que sabes hacer.",
                        en: "Select your skills or what you know how to do.",
                    }))
                    // reject("No hay staff tipo favorito")
                    return;
                    // throw new Error("Imagen no existe");
                }
                resolve(true)
            }).catch(e => {
                resolve(true)
                console.error(e);
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