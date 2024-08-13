import React from 'react';
import { Dimensions } from 'react-native'
import SCanvas from 'servisofts-canvas';


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    drawImage(ref) {
        if (!this.image) {
            ref.loadImage(this.props.img.uri).then((resp) => {
                this.image = resp;
                ref.repaint();
            })
        } else {
            var d = {
                wi: this.image.width, hi: this.image.height,
                wc: ref.canvas.width, hc: ref.canvas.height
            }
            var pw = d.wc / d.wi;
            var ph = d.hc / d.hi;
            var factor = 1;
            if (pw > ph) {
                factor = ph;
            } else {
                factor = pw;
            }
            var fw = d.wi * factor;
            var fh = d.hi * factor;

            var start = 0;
            if (fw < d.wc) {
                start = (d.wc - fw) / 2
            }
            ref.ctx.drawImage(this.image, start, 0, fw, fh);
        }
    }
    render() {

        return <SCanvas
            width={1024}
            height={1024}
            onClick={(evt) => {
                if (this.props.onClick) {
                    this.props.onClick(evt, this.ref)
                }
            }}
            paint={ref => {
                this.ref = ref;
                // this.ref.grid({});
                this.drawImage(ref);
                if (this.props.paint) {
                    this.props.paint(this.ref)
                }
            }}
        />
    }
}

export default (Canvas);