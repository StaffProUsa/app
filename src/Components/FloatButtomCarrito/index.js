import {TouchableOpacity, View} from 'react-native';
import {SIcon} from 'servisofts-component';
const FloatButtomCarrito = (props) => {
  if (props.esconder) {
    return <View />;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 60,
        width: 117,
        height: 52,
        // borderWidth: STheme.color.secondary + "22",
        // borderColor: STheme.color.secondary + "22",
        justifyContent: 'center',
        alignItems: 'center',
        // margin: 4,
        ...props.style
      }}>
      <SIcon name={'BgCart'} fill='#fff' />
      {/* <Svg name={"Add"} style={{
                width: "100%",
                height: "100%",
                // fill:"#C31"
            }} /> */}
    </TouchableOpacity>
  );
};
export default FloatButtomCarrito;
