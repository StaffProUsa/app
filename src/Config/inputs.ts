import { SInputsCofig, STheme } from 'servisofts-component';
import Background from 'servisofts-component/img/Background';
const inputs = (): SInputsCofig => {
    return {
        default: {
            LabelStyle: {
                position: "absolute",
                top: -11,
                left: 0,
                fontSize: 12,
                width: "100%",
                color: STheme.color.text,
                fontWeight:"bold",
                borderRadius: 4,
                // padding: 4,
            },
            View: {
                borderWidth: 1,
                borderColor: "#E0E0E0" + "30",
                height: 40,
                borderRadius: 4,
                marginTop: 35,
                paddingStart: 4,
                // backgroundColor: STheme.color.card,
                backgroundColor:STheme.color.card
                // backgroundColor: '#E0E0E0' + '35'
            },
            InputText: {
                // fontSize: 16,
                paddingStart: 4,
                color: STheme.color.text,
                placeholderTextColor: STheme.color.gray
                // backgroundColor: "#E0E0E0" + "55",
                // height: 55,
                // borderRadius: 16,
                // backgroundColor: STheme.color.card,
            },
            error: {
                // borderRadius: 16,
                borderWidth: 1,
                borderColor: STheme.color.danger
            },
            
        },
        dark: {
            LabelStyle: {
                position: "absolute",
                top: -11,
                left: 0,
                fontSize: 12,
                width: "100%",
                color: STheme.color.lightGray,
                fontWeight:"bold",
                borderRadius: 4,
                // padding: 4,
            },
            View: {
                borderWidth: 1,
                borderColor: "#E0E0E0" + "30",
                height: 40,
                borderRadius: 4,
                marginTop: 35,
                paddingStart: 4,
                // backgroundColor: STheme.color.card,
                backgroundColor:STheme.color.gray + "55"
                // backgroundColor: '#E0E0E0' + '35'
            },
            InputText: {
                // fontSize: 16,
                paddingStart: 4,
                color: STheme.color.text,
                placeholderTextColor: STheme.color.gray
                // backgroundColor: "#E0E0E0" + "55",
                // height: 55,
                // borderRadius: 16,
                // backgroundColor: STheme.color.card,
            },
            error: {
                // borderRadius: 16,
                borderWidth: 1,
                borderColor: STheme.color.danger
            }
        }
        
    }
}
export default inputs;
