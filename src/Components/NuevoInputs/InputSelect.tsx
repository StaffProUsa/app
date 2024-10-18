import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolate } from 'react-native-reanimated';
import { SText, STheme, SThread, SView } from 'servisofts-component';


// Datos de ejemplo

const ITEM_HEIGHT = 80; // Altura base del item

const Item = ({ item, index, scrollY, onPress }) => {
    // Estilo animado para cada ítem
    const animatedStyle = useAnimatedStyle(() => {
        // Calculamos la posición del ítem y cómo debería escalar
        const position = index * ITEM_HEIGHT - scrollY.value;

        const scale = interpolate(
            Math.abs(position),
            [0, ITEM_HEIGHT * 2], // Desde la posición central a los ítems lejanos
            [1.8, 0.8], // Escala central (1.5x) a escala pequeña (0.8x)
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
                <Text style={{ fontSize: 20 }}>{item}</Text>
            </Animated.View>
        </SView>
    );
};
const MyAnimatedFlatList = ({ data,  defaultValue = "", onChange }) => {
    const scrollY = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null); // Referencia al FlatList

    const [state, setState] = useState({ value: defaultValue, valueTo: undefined });
    const [layout, setLayout] = useState({ width: 0, height: 0 });
    const initialOffset = ((layout.height - ITEM_HEIGHT) / 2);
    useEffect(() => {
        if (defaultValue && data.includes(defaultValue)) {
            const defaultIndex = data.indexOf(defaultValue); // Obtener el índice del ítem predeterminado
            if (flatListRef.current) {
                flatListRef.current.scrollToOffset({
                    offset: defaultIndex * ITEM_HEIGHT, // Desplazarse al índice del ítem predeterminado
                    animated: false, // Animación desactivada al cargar por primera vez
                });
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
            state.value = viewableItems[0].item;
            if (!!state.valueTo) {
                if (state.value == state.valueTo) {
                    state.valueTo = undefined;
                }
                return;
            }

            onChange(state.value)

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
                renderItem={({ index, item }) => <Item item={item} index={index} scrollY={scrollY} onPress={() => {
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

export default MyAnimatedFlatList;
