import React from "react";
import { SIcon, STheme, SView } from "servisofts-component";

export default class TableIcon extends React.Component<{ name: string, fill?: string }> {
    render() {
        return <SView width={20} height={20} padding={3}><SIcon name={this.props.name as any} fill={STheme.color.text ?? this.props.fill} /></SView>
    }
}