import React from "react"
import { SImage, STheme, SView } from "servisofts-component"

export default ({ src, width = 30, height }) => {
    return <SView width={width} height={height ?? width} style={{
        borderRadius: 4,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: STheme.color.card
    }}>
        <SImage src={src+"?time="+new Date().getTime()} enablePreview style={{
            resizeMode: "cover"
        }} />
    </SView>
}