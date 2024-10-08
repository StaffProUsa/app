import React from "react"
import { Linking } from "react-native";
import { SText } from "servisofts-component"
export default (props) => {
    const text = props.children;
    if (!text) return null;

    // const urlPattern = /https?:\/\/[\w.-]+(:\d+)?(\/[^\s]*)?/gi;
    // const urlPattern = /((?:https\:\/\/)|(?:http\:\/\/)|(?:www\.))?([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:\??)[a-zA-Z0-9\-\._\?\,\'\/\\\+&%\$#\=~]+)/gi;
    // const urlPattern = 
    const exp = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
    // const urlPattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;
    // const urlPattern = /(?:https?:\/\/)?[\w.-]+(\.[a-z]{2,4})?\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;
    // const urlPattern = /(\bhttps?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5})(\b[^\s]*)(?=\s|$)/gi;
    // const urlPattern = /(\bhttps?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5})?(\b[^\s]*)(?=\s|$)|wa\.me\/\d+/gi;
    // const urlPattern = /(\bhttps?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5})?(\b[^\s]*)(?=\s|$)|wa\.me\/\d+/gi;




    let FINALTEXT = [];
    let lasIndex = 0;
    let match;
    while ((match = exp.exec(text)) !== null) {
        let urlVal = match[0];
        FINALTEXT.push(text.substring(lasIndex, match.index))
        FINALTEXT.push(<SText {...props} color={"#1465EE"} underLine onPress={() => {
            if (urlVal.indexOf(":\/\/") <= -1) {
                urlVal = "https://" + urlVal;
            }
            Linking.openURL(urlVal)
        }}>{urlVal}</SText>)
        lasIndex = match.index + urlVal.length
    }
    FINALTEXT.push(text.substring(lasIndex, text.length))


    return <SText {...props} row >{FINALTEXT}</SText>
}