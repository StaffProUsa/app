import SSocket from "servisofts-socket";
import MDLAbstract from "../MDLAbstract";
import { EventListener, ObjectStaffBoss, ObjectStaffUsuario } from "./type";

export default class evento extends MDLAbstract<EventListener> {

    

    async componentDidMount() {
        SSocket.addEventListener("onMessage", (data) => {
            if (data.component == "staff_usuario" && data.type == "invitarGrupoNotify") {
                this.dispatchEvent({ type: "onRecibeInvitation" });
            }
        })
    }

    getInvitacionesPendientes = async ({ key_usuario }) => {
        const resp: any = await SSocket.sendPromise({
            component: "staff_usuario",
            type: "getInvitacionesPendientes",
            key_usuario: key_usuario
        })
        return resp.data as ObjectStaffUsuario[];
    }

    getTrabajosProximos = async ({ key_usuario }) => {
        const resp: any = await SSocket.sendPromise({
            component: "staff_usuario",
            type: "getTrabajosProximos",
            key_usuario: key_usuario
        })
        return resp.data as ObjectStaffUsuario[];
    }
    getTrabajosProximosBoss = async ({ key_usuario }) => {
        const resp: any = await SSocket.sendPromise({
            component: "staff_usuario",
            type: "getTrabajosProximosBoss",
            key_usuario: key_usuario
        })
        return resp.data as ObjectStaffBoss[];
    }


    

}