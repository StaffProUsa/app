import React, { useState, useRef } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { SPage, SView, SText, STheme, SHr, SInput, SPopup } from 'servisofts-component';
import { Dimensions } from 'react-native';
import text from 'servisofts-component/Component/SInput2/types/text';

const Horario = ({onTimeChange}) => {
    const generateHours = (startHour = 0, startMinute = 0) => {
        const hours = [];
        for (let h = startHour; h < 24; h++) {
            for (let m = startMinute; m < 60; m += 15) {
                
                const hour = h.toString().padStart(2, '0');
                const minute = m.toString().padStart(2, '0');
                hours.push(`${hour}:${minute}`);
            }
            startMinute = 0;
        }
        return hours;
    };

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [allHours] = useState(generateHours());
    const scrollRef = useRef(null); // Referencia para el ScrollView
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);
    const [startTimeError, setStartTimeError] = useState(false);
const [endTimeError, setEndTimeError] = useState(false);
const startScrollRef = useRef(null); // Referencia para el ScrollView de Hora Inicio
const endScrollRef = useRef(null);

    

const handleSelectTime = (hour, type) => {
    if (type === "start") {
        setStartTime(hour);
        onTimeChange && onTimeChange({ startTime: hour, endTime }); // Llamar al callback
        SPopup.close("startTimePopup");
    } else {
        setEndTime(hour);
        onTimeChange && onTimeChange({ startTime, endTime: hour }); // Llamar al callback
        SPopup.close("endTimePopup");
    }
};
 
    const handleInputKeyPress = (e, type) => {
        if (e.nativeEvent.key === 'Enter') {
            const time = type === "start" ? startTime : endTime;
    
            // Validar el formato de la hora
            if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
                alert("Por favor, ingresa una hora válida en formato HH:mm");
            } else {
                // Cerrar el popup si el formato es válido
                if (type === "start") {
                    SPopup.close("startTimePopup");
                } else {
                    SPopup.close("endTimePopup");
                }
            }
        }
    };
    
    const handleInputChange = (text, type) => {
        // Reemplazar si el usuario ingresa un número de 3 o 4 dígitos sin :

        console.log("text", text);
        if((text.length >= 3 )&& text.match(/^\d+$/)) {
            text = text.replace(/(\d{2})(\d{1,2})/, "$1:$2");
        }
        if(text.length > 5) {
            text = text.substring(0, 5);
        }
        if (type === "start") {
            setStartTime(text);
        } else {
            setEndTime(text);
        }
    
        // Buscar el índice del primer valor que coincida
        const index = allHours.findIndex((hour) => hour.startsWith(text));
        if (index !== -1) {
            const scrollRef = type === "start" ? startScrollRef : endScrollRef;
            if (scrollRef.current) {
                setTimeout(() => {
                    scrollRef.current.scrollTo({ y: index * 38, animated: true });
                }, 50);
            }
        }
    };

const openPopup = (type) => {

    const currentValue = type === "start" ? startTime : endTime;

    const filteredHours = type === "end" && startTime
        ? generateHours()
        : allHours;

    SPopup.open({
        key: type === "start" ? "startTimePopup" : "endTimePopup",
        type: "2",
        content: (
            <SView
                withoutFeedback
                style={{

                    width: 270,
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: STheme.color.primary,
                    borderRadius: 10,
                    padding: 10,
                    alignSelf: "center",
                    marginTop: type === "start" ? 535 :675,
                    marginLeft: -250,
                }}
            >
                <ScrollView
                    ref={type === "start" ? startScrollRef : endScrollRef}
                    onContentSizeChange={() => {
                        // Hacer scroll solo si hay un valor actual
                        if (currentValue) {
                            const index = filteredHours.findIndex(h => h === currentValue);
                            if (index !== -1) {
                                const scrollRef = type === "start" ? startScrollRef : endScrollRef;
                                setTimeout(() => {
                                    scrollRef.current?.scrollTo({
                                        y: index * 38, // Altura de cada item
                                        animated: false,
                                    });
                                }, 50);
                            }
                        }
                    }}
                >
                    {filteredHours.map((hour) => (
                        <TouchableOpacity
                            key={hour}
                            onPress={() => handleSelectTime(hour, type)}
                            style={{
                                padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: "#ddd",
                                width: "100%",
                                
                            }}
                        >
                            <SText style={{ color: STheme.color.text }}>{hour}</SText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SView>
        ),
    });
};

    return (
        
           
                <SView style={{  width: "90%", maxWidth: 300 }}>
                    
                    <SText style={{ color:STheme.color.white, fontSize: 11, marginBottom: 3,fontWeight:'bold' }}>Hora de Inicio</SText>
                    
                        
                        <SInput
                        ref={startInputRef}
                        placeholder="Hora de Inicio"
                        value={startTime}
                        onPress={() => openPopup("start", startInputRef)}
                        onChangeText={(text) => handleInputChange(text, "start")}
                        onKeyPress={(e) => handleInputKeyPress(e, "start")}
                        style={{
                        borderRadius: 10,
                        padding: 10,                    

                        }}
                        /> 
                    
                    <SHr height={10} />

                    <SText style={{ color:STheme.color.white,fontSize: 11, marginBottom: 3,fontWeight:'bold' }}>Hora Final</SText>
                    
                        
                        <SInput style={{ backgroundColor: STheme.color.card, borderRadius: 12, padding: 5, marginBottom: 12 }}
                        ref={endInputRef}
                        placeholder="Hora Final"
                        value={endTime}
                        onPress={() => {
                        if (startTime) {
                        openPopup("end", endInputRef);
                        } else {
                        alert('Primero selecciona la hora de inicio');
                        }
                    }}
                        onChangeText={(text) => handleInputChange(text, "end")}
                        onKeyPress={(e) => handleInputKeyPress(e, "end")}
                        style={{
                        borderRadius: 10,
                        padding: 10,                   

                 }}
                        />
                    

                    
                </SView>    
    );

};

export default Horario;