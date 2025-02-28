type SRTEvent = {
    component: string;
    type: string;
    estado: string;
}

type SRTEventListener = (event: SRTEvent) => void;

export default class SRT {
    // Lista estática para almacenar los listeners
    static _LISTENERS: SRTEventListener[] = [];

    // Método para suscribirse a los eventos
    static subscribe(event: SRTEventListener) {
        if (typeof event === 'function' && !this._LISTENERS.includes(event)) {
            this._LISTENERS.push(event);
        }
        return event;
    }

    // Método para desuscribirse de los eventos
    static unsubscribe(event: SRTEventListener) {
        this._LISTENERS = this._LISTENERS.filter(listener => listener !== event);
    }

    // Método para notificar a todos los listeners con un evento
    static notify(event: SRTEvent) {
        this._LISTENERS.forEach(listener => listener(event));
    }
}