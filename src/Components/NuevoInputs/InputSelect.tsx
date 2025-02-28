import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolate } from 'react-native-reanimated';
import { SText, STheme, SThread, SView } from 'servisofts-component';


// Datos de ejemplo

// const ITEM_HEIGHT = 80; // Altura base del item

const Item = ({ item, index, scrollY, onPress, ITEM_HEIGHT = 50 }) => {
    // Estilo animado para cada ítem
    const animatedStyle = useAnimatedStyle(() => {
        // Calculamos la posición del ítem y cómo debería escalar
        const position = index * ITEM_HEIGHT - scrollY.value;

        const scale = interpolate(
            Math.abs(position),
            [0, ITEM_HEIGHT * 2], // Desde la posición central a los ítems lejanos
            [1.5, 0.8], // Escala central (1.5x) a escala pequeña (0.8x)
            'clamp'
        );

        return {
            transform: [{ scale }],
        };
    });

    return (
        <SView style={{
            justifyContent: 'center', alignItems: 'center',
            height: ITEM_HEIGHT,
        }} onPress={onPress}>
            <Animated.View style={[{
                justifyContent: 'center', alignItems: 'center',
            }, animatedStyle]}>
                <SText style={{ fontSize: 12 }}>{item}</SText>
            </Animated.View>
        </SView>
    );
};
const ocd = (e) => {
}
const InputSelect = ({ data, defaultValue = "", onChange = ocd, ITEM_HEIGHT, autoSelect = false }) => {
    const scrollY = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null); // Referencia al FlatList

    const [state, setState] = useState({ value: defaultValue, valueTo: undefined, ready: false });
    const [layout, setLayout] = useState({ width: 0, height: 0 });
    const initialOffset = ((layout.height - ITEM_HEIGHT) / 2);

    useEffect(() => {
        console.log("Enste es el defaultValue", defaultValue)
        if (defaultValue && data.includes(defaultValue)) {
            const defaultIndex = data.indexOf(defaultValue); // Obtener el índice del ítem predeterminado
            if (flatListRef.current) {
                flatListRef.current.scrollToOffset({
                    offset: defaultIndex * ITEM_HEIGHT, // Desplazarse al índice del ítem predeterminado
                    animated: false, // Animación desactivada al cargar por primera vez
                });
                state.ready = false;
            }
        } else {
            if (autoSelect && flatListRef.current) {
                state.value = data[0]
                if (onChange) onChange(state.value)
            }
        }

    }, [defaultValue, data, layout.height]); // Dependencias: defaultValue, data y layout.height



    const handleScrollEnd = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT); // Calcula el ítem más cercano
        if (flatListRef.current) flatListRef.current.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
    };
    const centerItemOnPress = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({
                offset: index * ITEM_HEIGHT, // Desplazarse al índice del ítem seleccionado
                animated: true,
            });
        }
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            if (!state.ready) {
                state.ready = true;
                return;
            }
            state.value = viewableItems[0].item;
            if (!!state.valueTo) {
                if (state.value == state.valueTo) {
                    state.valueTo = undefined;
                }
                return;
            }
            if (onChange) onChange(state.value)

        }
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center" }} onLayout={(e) => {
            setLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
        }}>
            <SView style={{ width: "100%", height: ITEM_HEIGHT, position: "absolute", backgroundColor: STheme.color.card }}></SView>
            {!layout.height ? null : <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ index, item }) => <Item item={item} index={index} scrollY={scrollY} ITEM_HEIGHT={ITEM_HEIGHT} onPress={() => {
                    // Aqui pon el codigo
                    state.value = item
                    state.valueTo = item
                    if (onChange) onChange(state.value)
                    centerItemOnPress(index)
                }} />}
                getItemLayout={(data, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                // decelerationRate="fast"
                // snapToInterval={ITEM_HEIGHT}
                onViewableItemsChanged={onViewableItemsChanged}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: initialOffset, paddingBottom: initialOffset }}
                onScroll={(e) => {
                    scrollY.value = e.nativeEvent.contentOffset.y
                    new SThread(50, "adjust_scroll", true).start(() => {
                        handleScrollEnd(e);
                    })
                }} // Manejador de scroll Reanimated v2

                scrollEventThrottle={16} // Esto asegura que el scroll sea más fluido

            />
            }
        </View>
    );
};

export default InputSelect;
