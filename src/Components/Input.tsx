// @ts-nocheck
import React, { Component, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, KeyboardTypeOptions, TextInputProps, TextProps } from 'react-native';
import { SColType, SHr, SInput, SNavigation, SPage, SText, STheme, SThread, SView } from 'servisofts-component';

const color = "#BBBBBB"
const colorGray = "#999999"
const colorGray2 = "#999999"
const colorCard = "#EEEEEE22"
const font = 'Montserrat'

type InputProps = {
    label?: string,
    info?: string,
    placeholder?: string,
    col?: any,
    multiline?: boolean,
    disabled?: boolean,
    height?: number | string,
    inputStyle?: TextInputProps["style"],
    onPress?: any,
    keyboardType?: KeyboardTypeOptions,
    onSubmitEditing?: any,
    defaultValue?: any,
    defaultData?: any,
    defaultInfo?: any,
    filter?: any,
    labelStyle?: TextProps["style"],
    infoStyle?: TextProps["style"],
    renderValue?: (evt: { value: any, data: any }) => any;
    onChangeText?: (txt: string) => any;
}

const Input = forwardRef((props: InputProps, ref) => {
    const [value, setValue] = useState(props.defaultValue);
    const [data, setData] = useState(props.defaultData ?? {});
    const [info, setInfo] = useState(props.defaultInfo);
    const [infoStyle, setInfoStyle] = useState({});
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (inputRef.current) inputRef.current.focus();
        },
        verify: (noStateChange?: boolean) => {
            if (props.required && !value) {
                setInfo("Campo requerido");
                setInfoStyle({ color: "red" });
                return false;
            }
            if (!noStateChange) {
                setInfo("");
                setInfoStyle({});
            }
            return true;
        },
        // verify(noStateChange?: boolean): boolean;
        getValue: () => {
            return value;
        },
        setValue: (e: any) => {
            setValue(e)
        },
        setInfo,
        setInfoStyle,
        getData: () => {
            return data;
        },
        setData: (e: any) => {
            setData(e)
        },
    }));

    return <SView col={props.col}>
        {!props.label ? null : <>
            <SText fontSize={12} font={"Montserrat"} color={color} style={props.labelStyle}>{props.label}</SText>
            <SHr h={3} />
        </>}
        <SView style={{
            width: "100%",
            height: props.height ?? 38,
        }} onPress={props.onPress}>
            <TextInput
                ref={inputRef}
                onChangeText={(e) => {
                    if (props.filter) e = props.filter(e);
                    setValue(e)
                    if (props.onChangeText) props.onChangeText(e);
                }}
                value={props.renderValue ? props.renderValue({ data: data, value: value }) : value}
                style={[{
                    width: "100%",
                    height: props.height ?? 34,
                    borderRadius: 5,
                    borderWidth: 1,
                    color: "#fff",
                    borderColor: STheme.color.card,
                    backgroundColor: colorCard,
                    padding: 0,
                    paddingStart: 8,
                    fontFamily: "Montserrat",
                    textAlignVertical: "center",
                    fontSize: 14,
                }, props.inputStyle ?? {}]}
                keyboardType={props.keyboardType ?? "default"}
                multiline={props.multiline}
                onSubmitEditing={props.onSubmitEditing}
                placeholderTextColor={colorGray2}
                editable={!props.onPress && !props.disabled}
                placeholder={props.placeholder} />
        </SView>
        <Text style={[{
            fontSize: 8, fontFamily: "Montserrat-SemiBold", color: colorGray2
        }, props.infoStyle, { ...infoStyle }]}>{info}</Text>
    </SView >
})

export default Input;



export const InputValidator = (props: { data: any, keys: string[] }) => {
    const faltantes: string[] = [];
    props.keys.map((k) => {
        if (!props.data[k]) faltantes.push(k);
    })
    return faltantes;
}