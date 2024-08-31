import React from "react";
import { SNavigation, SPage, SText } from "servisofts-component";
import SSocket from "servisofts-socket";

export default class index extends React.Component {
    key_company = SNavigation.getParam("key_company")
    state = {

    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "evento",
            type: "getAll",
            key_company: this.key_company
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {

        })
    }
    render() {
        return <SPage title={"Servisofts page"}>
            <SText>{JSON.stringify(this.state)}</SText>
        </SPage>;
    }
}