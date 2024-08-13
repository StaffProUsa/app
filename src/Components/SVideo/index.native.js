import React, { Component } from 'react';
import { SIcon, SText, STheme, SView, } from 'servisofts-component';

import Video from 'react-native-video';
import SSocket from 'servisofts-socket';

export default class SVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paused: this.props.paused,
            muted: true,
        };

    }

    play() {
        this.setState({ paused: false })
    }
    pause() {
        this.setState({ paused: true })
    }
    render() {
        // console.log(this.props.src)
        return <SView col={"xs-12"} center
            flex
            style={{
                overflow: "hidden",
            }}
            activeOpacity={1}
            height={this.props.height}
            onPress={() => {
                if (this.state.paused) {
                    this.play()
                } else {
                    this.pause()
                }

            }}
        >
            <Video
                ref={(ref) => {
                    this.player = ref
                }}
                muted={this.state?.muted}
                paused={this.state?.paused}
                repeat

                controls={this.props.controls}
                source={{
                    uri: this.props.src,
                    // uri: `https://repo.servisofts.com/class/kubernetes/001.-%20Todo%20lo%20que%20aprenderás%20sobre%20Kubernetes%20-%20Platzi1.mp4`,
                    // uri: `https://servisofts:Servisofts123.@repo.servisofts.com/video/calistenia-01.mp4`,
                    // type: 'mp4',
                    // headers: {
                    //     'range': 'bytes=0-'
                    // }
                }}
                // poster={SSocket.api.repo + "loading.gif?a="}
                maxBitRate={2000000}
                bufferConfig={{
                    minBufferMs: 5000, // Reducir aún más el tiempo mínimo de buffer
                    maxBufferMs: 10000,
                    bufferForPlaybackMs: 500, // Reducir el tiempo de buffer antes de comenzar la reproducción
                    bufferForPlaybackAfterRebufferMs: 1000, // Reducir el tiempo de buffer después de un rebuffering
                }}
                // useTextureView={true}
                resizeMode={"contain"}
                style={{
                    height: "100%",
                    width: "100%",
                }}
            // {...this.props}
            />
            {this.state.paused && <SView col={"xs-12"} flex style={{
                position: "absolute",
                // backgroundColor: "rgba(0,0,0,0.5)",
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
                    <SIcon name={(this.state.muted) ? "sound0" : "sound1"} fill={STheme.color.white} stroke={STheme.color.white} width={30} height={30} />
                </SView>
            </SView>
        </SView>
    }
}
