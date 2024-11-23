import React, { useState } from "react";
import { SLanguage, SText, STextProps } from "servisofts-component";

export default (props: STextProps & { limitString: number }) => {
    const [active, setActive] = useState(false);
    let txt = props.children?.toString() ?? "";
    if (txt.length > props.limitString) {
        const verMas = <SText
            font={props.font}
            color={props.color}
            fontSize={props.fontSize}
            underLine
            onPress={() => {
                setActive(!active)
            }}
        >{!active ? SLanguage.select({ en: "View more", es: "Ver mas" }) : SLanguage.select({ en: "View less", es: "Ver menos" })}</SText>
        if (active) {
            return <SText {...props}>{txt}{"\n"}{verMas}</SText>
        } else {
            return <SText {...props}>{txt?.substring(0, props.limitString)}...{verMas}</SText>
        }

    }
    return <SText {...props}>{props.children}</SText>
}