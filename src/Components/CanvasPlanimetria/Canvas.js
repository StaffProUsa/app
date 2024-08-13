import React from 'react';
import { Dimensions } from 'react-native'
import SCanvas from 'servisofts-canvas';
import { SImage, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    drawImage(ref) {
        if (!this.image) {
            if (this.props.img) {
                ref.loadImage(this.props.img.uri).then((resp) => {
                    this.image = resp;
                    this.drawImage(ref);
                    ref.repaint();
                })
            }
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

    repaint() {
        if (this.ref) {
            this.ref.repaint();
        }
    }
    render() {
        if (this.ref) {
            this.ref.repaint();
        }
        return <>
            <SView width={1024}
                height={1024}>
                <SImage src={SSocket.api.root + "evento/" + this.props.key_evento} />
            </SView>
            <SView width={1024}
                height={1024} style={{
                    position: "absolute"
                }}>
                <SCanvas
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
                        console.log("repinto img")
                        // this.drawImage(ref);
                        if (this.props.paint) {
                            this.props.paint(this.ref)
                        }
                    }}
                />
            </SView>
        </>
    }
}

export default (Canvas);