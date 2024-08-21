import { SInputsCofig, STheme } from 'servisofts-component';
import Background from 'servisofts-component/img/Background';
const inputs = (): SInputsCofig => {
    return {
        default: {
            LabelStyle: {
                position: "absolute",
                top: -10,
                left: 0,
                fontSize: 14,
                width: "100%",
                color: STheme.color.text,
                borderRadius: 4,
                padding: 4,
            },
            View: {
                borderWidth: 1,
                borderColor: "#E0E0E0" + "40",
                height: 55,
                borderRadius: 6,
                marginTop: 50,
                paddingStart: 16,
                // backgroundColor: STheme.color.card,
                backgroundColor:"#08080B"
                // backgroundColor: '#E0E0E0' + '35'
            },
            InputText: {
                // fontSize: 16,
                paddingStart: 8,
                color: STheme.color.text,
                placeholderTextColor: STheme.color.gray
                // backgroundColor: "#E0E0E0" + "55",
                // height: 55,
                // borderRadius: 16,
                // backgroundColor: STheme.color.card,
            },
            error: {
                // borderRadius: 16,
                borderWidth: 2,
                borderColor: STheme.color.danger
            }
        },
        romeo: {
            LabelStyle: {
                position: 'absolute',
                top: -14,
                left: 2,
                fontSize: 16,
                font: 'Roboto',
                width: '110%'
                // fontWeight: "bold"
                // color: STheme.color.text,
            },
            View: {
                height: 55,
                marginTop: 50
                // paddingEnd: 10,
                // color: STheme.color.text,
            },
            InputText: {
                fontSize: 16,
                paddingStart: 16,
                // color: STheme.color.text,
                //backgroundColor: "#E0E0E0" + "90",
                // backgroundColor: "#E0E0E0" + "90",
                borderRadius: 8,
                backgroundColor: '#E0E0E0' + '35'
            },
            error: {
                borderWidth: 2,
                borderRadius: 8,
                borderColor: STheme.color.danger
            }
        }
    }
}
export default inputs;
