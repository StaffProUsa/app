import { STheme } from "servisofts-component"

export default {
    styles: () => {
        console.log("Thema",STheme.getTheme())
        const card = STheme.getTheme() == "dark" ? STheme.color.card : "#999999";
        return {
            text: STheme.color.gray,
            // accent: STheme.color.secondary,
            // background: STheme.color.secondary,
            header: STheme.color.barColor,
            background: STheme.color.background,
            card: card,
            border: card,

        }
    },
    cellStyle: () => {
        return {
            borderWidth: 0,
            // padding: 4,
            // justifyContent: "flex-start"
        }
    },
    textStyle: () => {
        return {
            fontSize: 12,
        }
    }
}