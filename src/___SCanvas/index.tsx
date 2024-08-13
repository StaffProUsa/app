// @ts-nocheck
import React, { Component } from 'react';

type SCanvas_props = {
    width: number,
    height: number,
    stats?: boolean,
    onLoad: Function,
    zoomEnabled?: boolean
}
export default class SCanvas extends Component<SCanvas_props> {
    props: any;
    canvas;
    ctx;
    zoom = 0.5;
    state;
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    redraw() {
        if (!this.canvas) return;
        if (!this.ctx) return;
        // var p1 = this.ctx.transformedPoint(0, 0);
        // var p2 = this.ctx.transformedPoint(, this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.scale(this.zoom, this.zoom)
        // this.ctx.width = image.width * scanvas.zoom
        // this.ctx.height = image.height * scanvas.zoom

        if (this.props.onLoad) this.props.onLoad(this.canvas, this)
        this.paintSelect();

    }
    componentDidMount() {

        var c: any = document.getElementById("myCanvas");
        this.canvas = c;
        this.ctx = c.getContext("2d");

        if (this.props.zoomEnabled) {
            this.canvas.addEventListener("mousewheel", this.mousewheel)
            this.canvas.addEventListener("mousemove", this.mousemove)
            this.canvas.addEventListener("click", this.click)
            this.canvas.addEventListener("mousedown", this.mousedown)
            this.canvas.addEventListener("mouseup", this.mouseup)

        }
        if (this.props.onLoad) this.props.onLoad(this.canvas, this)
    }

    componentWillUnmount(): void {
        if (this.props.zoomEnabled) {
            this.canvas.removeEventListener("mousewheel", this.mousewheel)
            this.canvas.removeEventListener("mousemove", this.mousemove)
            this.canvas.removeEventListener("click", this.click)
            this.canvas.removeEventListener("mousedown", this.mousedown)
            this.canvas.removeEventListener("mouseup", this.mouseup)


        }
    }

    paintSelect() {
        var r = this.state.select;
        if (!r) return;

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#fff";
        this.ctx.strokeRect(r.x1, r.y1, r.x2, r.y2);
        this.ctx.fillStyle = "#ffffff32";
        this.ctx.fillRect(r.x1, r.y1, r.x2, r.y2);
    }
    currentPos;
    mouseup = (evt) => {
        var pos = {
            x: evt.offsetX,
            y: evt.offsetY,
            d: ""
        }
        if (this.currentPos) {
            // this.state.select = {
            //     x1: this.currentPos.x,
            //     y1: this.currentPos.y,
            //     x2: pos.x,
            //     y2: pos.y
            // }
            this.currentPos = null;

        }
    }
    mousedown = (evt) => {
        var pos = {
            x: evt.offsetX,
            y: evt.offsetY,
            d: ""
        }
        this.currentPos = pos;
    }
    click = (evt) => {
        var pos = {
            x: evt.offsetX,
            y: evt.offsetY,
            d: ""
        }
        this.detectColors(pos)
    }
    mousemove = (evt) => {
        if (this.currentPos) {
            var pos = {
                x: evt.offsetX,
                y: evt.offsetY,
                d: ""
            }
            var r = {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
            }
            if (this.currentPos.x > pos.x) {
                r.x1 = pos.x;
                r.x2 = this.currentPos.x - pos.x
            } else {
                r.x1 = this.currentPos.x;
                r.x2 = pos.x - this.currentPos.x
            }
            if (this.currentPos.y > pos.y) {
                r.y1 = pos.y;
                r.y2 = this.currentPos.y - pos.y
            } else {
                r.y1 = this.currentPos.y;
                r.y2 = pos.y - this.currentPos.y
            }
            this.state.select = r;
            this.redraw()

        }
    }
    mousewheel = (evt) => {
        this.zoom += evt.deltaY * 0.000314
        if (this.zoom > 1.8) {
            this.zoom = 1.8
            return
        };
        if (this.zoom < 0.2) {
            this.zoom = 0.2
            return
        }
        this.updateZoon();
    }
    updateZoon = () => {
        if (!this.ctx) return;

        this.redraw()
    }
    loadImage(uri) {
        return new Promise((resolve, reject) => {
            let img1 = new Image();
            img1.addEventListener('load', () => {
                resolve(img1);
            })
            img1.src = uri;
        })
    }


    getPixelColor({ x, y }, space = 1) {
        var p = this.ctx.getImageData(x, y, space, space).data;
        var rgba = {
            "r": p[0],
            "g": p[1],
            "b": p[2],
            "a": p[3],
        }
        this.ctx.fillRect(x, y, space, space);

        return rgba;
    }


    detectColors(pos) {
        var c_1 = this.getPixelColor(pos);

    }



    render() {
        return (
            <canvas
                id="myCanvas"
            
            >
            </canvas>
        );
    }
}
