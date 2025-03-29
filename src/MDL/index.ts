import Evento from "./Evento";
import Validaciones from "./Validaciones"

export const MDL = {
    evento: new Evento(),
    validaciones: new Validaciones(),
};


export const componentDidMount = async () => {
    const list = Object.values(MDL)
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        await element.componentDidMount();
    }
}

export default MDL