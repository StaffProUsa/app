import Evento from "./Evento";


export const MDL = {
    evento: new Evento()
};


export const componentDidMount = async () => {
    const list = Object.values(MDL)
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        await element.componentDidMount();
    }
}

export default MDL