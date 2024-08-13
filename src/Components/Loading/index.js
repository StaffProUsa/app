import React, { Component } from 'react'
import { SLoad, SView } from 'servisofts-component'
export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }
    setLoading(data) {
        this.state.loading = data;
        this.setState({
            ...this.state
        })
    }
    render() {
        if (!this.state.loading) return null;
        return (<SView col={"xs-12"} height style={{
            position: "absolute",
            top: 0,
            backgroundColor: "#000",
            opacity: 0.8,
        }} center withoutFeedback>
            <SLoad />
        </SView>
        )
    }
}