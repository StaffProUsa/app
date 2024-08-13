import React from 'react';

import { SHr, SIcon, SInput, SPopup, SRangeSlider, SText, STheme, SView } from "servisofts-component";
import Abstract from "./_abstract";
export default class index extends Abstract {

    constructor(Menu) {
        super("select_color", Menu)
    }

    clear() {
        super.clear();
        this.Menu.state.islas = null;
    }
    async getColor(point, ref) {
        var colors = await ref.ctx.getImageData(point.x, point.y, 1, 1);
        colors = Object.values(colors.data);
        var color = {
            r: colors[0],
            g: colors[1],
            b: colors[2],
            a: colors[3],
        }
        this.Menu.state["_aux_color"] = color;
        // this.analizar_evento();
        this.setValue(false);
    }
    onClick(evt, ref) {
        super.onClick(evt, ref);
        var point = { x: evt.offsetX, y: evt.offsetY }
        this.getColor(point, ref)
        // this.setValue(point);
    }
    paint(ref) {
        super.paint(ref);
        const { ctx } = ref;
        ctx.strokeStyle = this.colors.base
        // ctx.fillStyle = this.colors.card
        ctx.lineWidth = 1;
        var { punto_ini, punto_fin } = this.Menu.state;
        var x = punto_fin.x < punto_ini.x ? punto_fin.x : punto_ini.x;
        var y = punto_fin.y < punto_ini.y ? punto_fin.y : punto_ini.y;
        var w = punto_fin.x > punto_ini.x ? punto_fin.x - punto_ini.x : punto_ini.x - punto_fin.x;
        var h = punto_fin.y > punto_ini.y ? punto_fin.y - punto_ini.y : punto_ini.y - punto_fin.y;
        // ctx.strokeRect(x, y, w, h)

    }


    compareColor(c1, c2, d = 20) {
        if (!(c1.r - d < c2.r && c1.r + d > c2.r)) {
            return false;
        }
        if (!(c1.g - d < c2.g && c1.g + d > c2.g)) {
            return false;
        }
        if (!(c1.b - d < c2.b && c1.b + d > c2.b)) {
            return false;
        }
        if (!(c1.a - d < c2.a && c1.a + d > c2.a)) {
            return false;
        }
        return true;
    }
    analiceMatrix(d) {
        var { punto_ini, punto_fin, _aux_color } = this.Menu.state;
        var x = punto_fin.x < punto_ini.x ? punto_fin.x : punto_ini.x;
        var y = punto_fin.y < punto_ini.y ? punto_fin.y : punto_ini.y;
        var w = punto_fin.x > punto_ini.x ? punto_fin.x - punto_ini.x : punto_ini.x - punto_fin.x;
        var h = punto_fin.y > punto_ini.y ? punto_fin.y - punto_ini.y : punto_ini.y - punto_fin.y;
        const { ctx } = this.ref;
        this.ref.getColorMatrix(x, y, w, h).then(matrix => {
            for (let i = 0; i < matrix.length; i++) {
                const row = matrix[i];
                for (let j = 0; j < row.length; j++) {
                    const p = row[j];
                    if (this.compareColor(_aux_color, p, d)) {
                        matrix[i][j].equal = true;
                        matrix[i][j].x = j;
                        matrix[i][j].y = i;
                        matrix[i][j].dx = j + x;
                        matrix[i][j].dy = i + y;
                    }
                }
            }
            this.matrix = matrix;
            this.islas = this.armarRutas(x, y);

        })
    }


    createPoint4(p) {
        return {
            x1: p.x, y1: p.y,
            x2: p.x + p.w, y2: p.y,
            x3: p.x + p.w, y3: p.y + p.h,
            x4: p.x, y4: p.y + p.h,
        }
    }


    _isInner(x, y, p_1) {
        var b = parseInt(this.inp_e.getValue()) ?? 2;

        if (x >= p_1.x1 - b && x <= p_1.x2 + b && y >= p_1.y1 - b && y <= p_1.y3 + b) {
            return true;
        }
        return false;
    }
    isInner(p, p2) {
        var p_1 = this.createPoint4(p);
        var p_2 = this.createPoint4(p2);
        if (this._isInner(p_2.x1, p_2.y1, p_1)) {
            return true;
        }
        if (this._isInner(p_2.x2, p_2.y2, p_1)) {
            return true;
        }
        if (this._isInner(p_2.x3, p_2.y3, p_1)) {
            return true;
        }
        if (this._isInner(p_2.x4, p_2.y4, p_1)) {
            return true;
        }
        return false;
    }
    mergeIsle(obj, obj2) {
        var min = {
            x: obj.x <= obj2.x ? obj.x : obj2.x,
            y: obj.y <= obj2.y ? obj.y : obj2.y,
        }
        var max = {
            x: obj.x + obj.w >= obj2.x + obj2.w ? obj.x + obj.w : obj2.x + obj2.w,
            y: obj.y + obj.h >= obj2.y + obj2.h ? obj.y + obj.h : obj2.y + obj2.h,
        }
        obj = {
            x: min.x,
            y: min.y,
            w: max.x - min.x,
            h: max.y - min.y
        }
        return obj;
    }
    normalizarIslas(islas) {
        var islasNormales = [];

        for (let i = 0; i < islas.length; i++) {
            const isla = islas[i];
            var p = this.normalizarIsla(isla);
            islasNormales.push(p);

        }
        islasNormales = this.normaliceWithSize(islasNormales, null, false);
        islasNormales = this.recurReduceIsle(islasNormales);
        islasNormales = this.normaliceWithSize(islasNormales, null, true);
        // islasNormales = this.recurReduceIsle(islasNormales);
        var islasFinal = islasNormales;

        // islasFinal = this.recurReduceIsle(islasFinal);
        // islasFinal = this.normaliceWithSize(islasFinal);

        for (let i = 0; i < islasFinal.length; i++) {
            const isla = islasFinal[i];
            this.ref.ctx.strokeStyle = this.colors.base
            this.ref.ctx.lineWidth = 2;
            this.ref.ctx.strokeRect(isla.x, isla.y, isla.w, isla.h)

            // this.ref.ctx.fillStyle = this.colors.card
            // this.ref.ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
        }

        this.Menu.setState({
            islas: islasFinal
        });
    }

    normaliceWithSize(arr, d, replace) {
        d = parseFloat(this.inp_f.getValue());
        var fiw = {};
        var fih = {};

        for (let i = 0; i < arr.length; i++) {
            const p = arr[i];
            if (!p.x || !p.y || !p.w | !p.h) continue;
            if (!fiw[p.w]) {
                fiw[p.w] = 0;
            }
            if (!fih[p.h]) {
                fih[p.h] = 0;
            }
            fiw[p.w] += 1;
            fih[p.h] += 1;

        }

        var xifi_x = 0;
        var cant_x = 0
        Object.keys(fiw).map(k => {
            var o = fiw[k];
            cant_x += parseFloat(o);
            xifi_x += parseFloat(k) * parseFloat(o);

        })
        var xifi_y = 0;
        var cant_y = 0
        Object.keys(fih).map(k => {
            var o = fih[k];
            if (o && k) {
                cant_y += parseFloat(o);
                xifi_y += parseFloat(k) * parseFloat(o);
            }

        })
        var mx = xifi_x / cant_x;
        var my = xifi_y / cant_y;
        var arrFinal = [];
        for (let i = 0; i < arr.length; i++) {
            var p = arr[i];
            if ((mx - d <= p.w && mx + d >= p.w) && (my - d <= p.h && my + d >= p.h)) {
                if (replace) {
                    p.w = mx;
                    p.h = my;
                }

                arrFinal.push(p);
            }

        }
        return arrFinal;
    }
    recurReduceIsle(arr) {
        for (let i = 0; i < arr.length; i++) {
            var obj = arr[i];
            arr = this.reduceIsle(obj, arr);
        }
        return arr;
    }
    reduceIsle(obj, arr) {
        var inner = false;
        var arrF = [];
        for (let j = 0; j < arr.length; j++) {
            var obj2 = arr[j];
            if (obj != obj2) {
                if (!!obj.x && !!obj2.x) {
                    if (this.isInner(obj, obj2)) {
                        inner = true;
                        obj = this.mergeIsle(obj, obj2);

                    } else {
                        arrF.push(obj2);
                    }
                }
            }
        }
        arrF.push(obj);


        if (inner) {
            arrF = this.recurReduceIsle(arrF);
         
        }
        return arrF;
    }
    normalizarIsla(isla) {
        var maxX = 0;
        var minX = 0;
        var maxY = 0;
        var minY = 0;
        for (let i = 0; i < isla.length; i++) {
            const p = isla[i];
            if (!maxX) maxX = p.dx;
            if (p.dx > maxX) {
                maxX = p.dx;
            }
            if (!minX) minX = p.dx;
            if (p.dx < minX) {
                minX = p.dx;
            }
            if (!maxY) maxY = p.dy;
            if (p.dy > maxY) {
                maxY = p.dy;
            }
            if (!minY) minY = p.dy;
            if (p.dy < minY) {
                minY = p.dy;
            }
        }
        return {
            x: minX,
            y: minY,
            w: maxX - minX,
            h: maxY - minY
        }
    }

    armarRutas(dx, dy) {
        const { ctx } = this.ref;
        var islas = [];
        for (let i = 0; i < this.matrix.length; i++) {
            const row = this.matrix[i];
            for (let j = 0; j < row.length; j++) {
                var p = row[j];
                if (p.equal && !p.marcado) {
                    let isla = [];
                    p.marcado = true;
                    this.armarIsla(isla, p)
                    islas.push(isla);
                }
            }
        }
        return this.normalizarIslas(islas);
    }
    armarIsla = (isla, punto, errores = 0) => {
        this.verificarAdyacente(isla, errores, punto, punto.y - 1, punto.x - 1);
        this.verificarAdyacente(isla, errores, punto, punto.y - 1, punto.x);
        this.verificarAdyacente(isla, errores, punto, punto.y - 1, punto.x + 1);
        this.verificarAdyacente(isla, errores, punto, punto.y, punto.x - 1);
        this.verificarAdyacente(isla, errores, punto, punto.y, punto.x + 1);
        this.verificarAdyacente(isla, errores, punto, punto.y + 1, punto.x - 1);
        this.verificarAdyacente(isla, errores, punto, punto.y + 1, punto.x);
        this.verificarAdyacente(isla, errores, punto, punto.y + 1, punto.x + 1);
    };

    verificarAdyacente(isla, errores, punto, y, x) {
        if (this.matrix[y] && this.matrix[y][x]) {
            let puntoAdyacente = this.matrix[y][x];
            if (!puntoAdyacente.marcado && errores < 2) {
                // punto.adyacentes.push(puntoAdyacente);
                // puntoAdyacente.adyacentes.push(punto);
                isla.push(puntoAdyacente);
                puntoAdyacente.marcado = true;
                this.armarIsla(isla, puntoAdyacente);
            }

        }
    }
    analizar_evento() {
        this.ref.repaint();
        this.analiceMatrix(this.inp_d.getValue());
    }
    getButtoms() {
        var color = this.Menu?.state["_aux_color"];
        if (!color) return;
        return <SView col={"xs-12"} row center>
            <SView col={"xs-8"} center row>
                <SText center fontSize={10}>{"Se encontraron "}</SText>
                <SView style={{
                    width: 32,
                    height: 32,
                    borderRadius: 100,
                    backgroundColor: STheme.color.card
                }} center>
                    <SText center bold fontSize={10}>{this.Menu?.state?.islas?.length ?? 0}</SText>
                </SView>
                <SText center fontSize={10}>{"espacios"}</SText>
            </SView>
            <SView col={"xs-4"} center row>
                <SView style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    backgroundColor: STheme.color.card
                }} onPress={() => {
                    this.analizar_evento()
                }} center>
                    {/* <SText bold >{"FIND"}</SText> */}
                    <SIcon name={"Search"} fill={STheme.color.text} width={28} />
                </SView>
                <SView width={8} />
                <SView style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    backgroundColor: STheme.color.card
                }} onPress={() => {
                    if (!this.Menu?.state?.islas) {
                        SPopup.alert("Deve seleccionar almenos un espacio.");
                        return;
                    }
                    if (!this.Menu?.state?.islas.lenght <= 0) {
                        SPopup.alert("Deve seleccionar almenos un espacio.");
                        return;
                    }
                    this.setValue(this.Menu.state.islas)
                }} center>
                    <SText bold >{"OK"}</SText>
                </SView>

            </SView>

        </SView>
    }
    render() {
        var color = this.Menu?.state["_aux_color"];
        return (
            <SView center height={240} col={"xs-12"} style={{
                padding: 8
            }}>
                <SText >{"Seleccione un color para generar los espacios"}</SText>
                <SHr />
                <SView row col={"xs-12"} height={120} center>
                    <SView style={{
                        width: 50,
                        height: 50,
                        backgroundColor: `rgba(${color?.r},${color?.g},${color?.b},${color?.a})`,
                        borderRadius: 100,
                        borderWidth: 1,
                        borderColor: STheme.color.card

                    }}></SView>
                    <SView width={8} />
                    <SView flex height center>
                        <SHr />
                        <SRangeSlider ref={ref => this.inp_d = ref} range={[1, 50]} defaultValue={20} />
                        <SHr />
                        <SRangeSlider ref={ref => this.inp_e = ref} range={[1, 10]} defaultValue={3} />
                        <SHr />
                        <SRangeSlider ref={ref => this.inp_f = ref} range={[1, 100]} defaultValue={20} />
                    </SView>

                </SView>



                {/* <SHr /> */}

                {this.getButtoms()}
            </SView>
        )
    }
}