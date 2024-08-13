import React, { Component } from 'react';
import { SGradient, SIcon, SText, STheme, SThread, SView, } from 'servisofts-component';


export default class SVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muted: true,
        };

    }
    play() {
        this.video.play().then(e => {
            this.state.paused = false;
        }).catch(e => {
            this.state.paused = true;
            this.video.pause()

            console.error(e)
        })
    }
    pause() {
        this.video.pause()
    }
    componentDidMount() {
        new SThread(100, "before", true).start(() => {

            this.video.play().then(e => {
                this.state.paused = false;
            }).catch(e => {
                this.state.paused = true;
                this.video.pause()
                console.error(e)
            })

        })
    }

    render() {
        console.log(this.props.src)
        return <SView col={"xs-12"} flex style={{
            overflow: "hidden"
        }} center onPress={() => {
            this.state.paused = !this.state.paused;
            if (!this.state.paused) {
                this.video.play()
            } else {
                this.video.pause()
            }
            this.setState({ paused: this.state.paused })
        }}>
            <video ref={ref => {
                if (ref) {
                    this.video = ref
                }
            }} src={this.props.src} style={{
                objectFit: "cover",
                width: "100%",
                flex: 1,
                // ...this.props.style
            }} autoPlay={!this.props.paused} preload="metadata"
            muted={this.state.muted}
            >

            </video>
            {this.state.paused && <SView col={"xs-12"} flex style={{
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
                width: "100%",
                height: "100%",
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <SIcon name={"playVideo"} fill={STheme.color.white} stroke={STheme.color.white} width={70} height={70} />
                {/* <SText color={"#fff"} fontSize={30}>Play</SText> */}
            </SView>}
            <SView col={"xs-12"} >
                <SView width={50} height={50} style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    padding: 10,
                    zIndex: 109,
                }}
                onPress={() => {
                    this.state.muted = !this.state.muted;
                    this.setState({ muted: this.state.muted })
                }}
                >
                    <SIcon name={(this.state.muted)? "sound0": "sound1"} fill={STheme.color.white} stroke={STheme.color.white} width={30} height={30} />
                </SView>
            </SView>
            {/* <SGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0)"]} /> */}
        </SView>
    }
}
