import SSocket from "servisofts-socket"
import Model from "../../Model";


export default {
    getAllCompanyUser: async () => {
        const resp = await SSocket.sendPromise({
            component: "usuario_company",
            type: "getAllCompanyUser",
            key_usario: Model.usuario.Action.getKey()
        })
        return resp;
    }
}