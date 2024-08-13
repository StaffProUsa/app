import Share, { ShareOptions } from 'react-native-share'
export default class Compartir {
    static open(options: ShareOptions) {
        return Share.open(options)
    }
}