import FetchFunction from "./FetchFunction";

export default class SFetchBlob {

    constructor() {

    }

    descargar = async (props, callback) => {
        console.log("INICIANDO DESCARGA....");
        console.log(" DESCARGA...." + props.cancelar);
     
        var url = props.url + "?key_usuario=" + props.key_usuario;
        console.log(url);
        var myInit = {
            method: 'GET',
            cache: "no-cache",

        };
        try {
            var myRequest = new Request(url, myInit);
            let response = await fetch(myRequest);
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');
            var lastP = false;
            let receivedLength = 0; // received that many bytes at the moment
            let chunks = []; // array of received binary chunks (comprises the body)
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                if (props.cancelar.estado) {
                    controller.abort()
                    break;
                }
                chunks.push(value);
                receivedLength += value.length;
                var resp = FetchFunction.progresFormat(contentLength, receivedLength);

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
                // console.log(`Received ${receivedLength} of ${contentLength}`)
            }
            let chunksAll = new Uint8Array(receivedLength); // (4.1)
            let position = 0;
            for (let chunk of chunks) {
                chunksAll.set(chunk, position); // (4.2)
                position += chunk.length;
            }
            var blob = new Blob([chunksAll]);
            const uri = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = uri;
            var arrUr = props.descripcion.split("/");
            var name = "";
            if (props.tipo == 0) {
                name = arrUr[arrUr.length - 1] + ".zip";
            } else {
                name = arrUr[arrUr.length - 1]
            }
            a.download = name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(uri);
        } catch (error) {
            console.log(error.message)
        }

    }
}