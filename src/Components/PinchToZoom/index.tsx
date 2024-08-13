import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import {
  PanGesture,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const useLayout = () => {
  const [layout, setLayout] = useState<LayoutChangeEvent["nativeEvent"]["layout"] | undefined>();
  const onLayout = (e) => {
    setLayout(e.nativeEvent.layout);
  };

  return { onLayout, layout };
};

export const PinchToZoom = ({ children }) => {
  const scale = useSharedValue(1);
  const origin = { x: useSharedValue(0), y: useSharedValue(0) };
  const translation = { x: useSharedValue(0), y: useSharedValue(0) };
  const { onLayout, layout } = useLayout();


  const handlerPan = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({

  })
  const handler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart(e, ctx: any) {
      // On android, we get focalX and focalY 0 in onStart callback. So, use a flag and set initial focalX and focalY in onActive
      // 😢 https://github.com/software-mansion/react-native-gesture-handler/issues/546
      ctx.start = true;
      ctx.scale = scale.value
      ctx.translation = {
        x: translation.x.value,
        y: translation.y.value,
      }
    },

    onActive(e, ctx: any) {
      if (e.numberOfPointers < 2) return;
      if (ctx.start) {
        origin.x.value = e.focalX;
        origin.y.value = e.focalY;

        ctx.offsetFromFocalX = origin.x.value;
        ctx.offsetFromFocalY = origin.y.value;
        ctx.prevTranslateOriginX = origin.x.value;
        ctx.prevTranslateOriginY = origin.y.value;
        ctx.prevPointers = e.numberOfPointers;

        ctx.start = false;
      }

      if ((ctx.scale * e.scale) <= 0.2) {
        scale.value = 0.2
      } else {
        scale.value = ctx.scale * e.scale
      }


      if (ctx.prevPointers !== e.numberOfPointers) {
        ctx.offsetFromFocalX = e.focalX;
        ctx.offsetFromFocalY = e.focalY;
        ctx.prevTranslateOriginX = ctx.translateOriginX;
        ctx.prevTranslateOriginY = ctx.translateOriginY;
      }

      ctx.translateOriginX =
        ctx.prevTranslateOriginX + e.focalX - ctx.offsetFromFocalX;
      ctx.translateOriginY =
        ctx.prevTranslateOriginY + e.focalY - ctx.offsetFromFocalY;

      translation.x.value = ctx.translation.x + ctx.translateOriginX - origin.x.value;
      translation.y.value = ctx.translation.y + ctx.translateOriginY - origin.y.value;

      ctx.prevPointers = e.numberOfPointers;
    },
    onEnd() {
      // scale.value = withSpring(1, {
      //   stiffness: 60,
      //   overshootClamping: true,
      // });
      // translation.x.value = withSpring(0, {
      //   stiffness: 60,
      //   overshootClamping: true,
      // });
      // translation.y.value = withSpring(0, {
      //   stiffness: 60,
      //   overshootClamping: true,
      // });
    },
  });

  const imageLeftForSettingTransformOrigin = layout ? -layout.height / 2 : 0;
  const imageTopForSettingTransformOrigin = layout ? -layout.width / 2 : 0;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translation.x.value },
        {
          translateY: translation.y.value,
        },

        { translateX: imageLeftForSettingTransformOrigin + origin.x.value },
        { translateY: imageTopForSettingTransformOrigin + origin.y.value },
        {
          scale: scale.value,
        },
        { translateX: -(imageLeftForSettingTransformOrigin + origin.x.value) },
        { translateY: -(imageTopForSettingTransformOrigin + origin.y.value) },
      ],
    };
  }, [imageTopForSettingTransformOrigin, imageLeftForSettingTransformOrigin]);

  const clonedChildren = useMemo(
    () =>
      React.cloneElement(children, {
        style: [StyleSheet.flatten(children.props.style), animatedStyles],
      }),
    [children]
  );

  return (
    <PinchGestureHandler onGestureEvent={handler} >
    {/* <PanGestureHandler onGestureEvent={handler}> */}
      <Animated.View onLayout={onLayout}>{clonedChildren}</Animated.View>
    {/* </PanGestureHandler> */}
  </PinchGestureHandler>
  );
};


// const Example = () => (
//   <PinchToZoom>
//     <Animated.Image
//       style={{ width: 277, height: 368 }}
//       source={{
//         uri: "https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80",
//       }}
//     />
//   </PinchToZoom>
// );