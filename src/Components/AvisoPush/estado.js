import { Platform } from 'react-native';
import Firebase from '../../Firebase';

// Estado de las push web en este navegador, compartido por el aviso del inicio y la fila de Perfil:
// "no_web" | "ios" (iPhone sin instalar) | "activar" | "bloqueado" | "activo" | "apagado" (lo apagó el usuario) | "sin_soporte"
export function estadoPush() {
    if (Platform.OS != "web") return "no_web";
    if (Firebase.esIOS() && !Firebase.esInstalada()) return "ios";
    const permiso = Firebase.permiso();
    if (permiso == "default") return "activar";
    if (permiso == "denied") return "bloqueado";
    if (permiso == "granted") return Firebase.apagadoPorUsuario() ? "apagado" : "activo";
    return "sin_soporte";
}

export const PASOS_IOS = [
    { es: "1. Toca el botón Compartir (el cuadrado con la flecha ⬆️) en Safari.", en: "1. Tap the Share button (the square with the arrow ⬆️) in Safari." },
    { es: "2. Elige \"Agregar a pantalla de inicio\".", en: "2. Choose \"Add to Home Screen\"." },
    { es: "3. Abre Staff Pro USA desde el nuevo ícono y activa las notificaciones.", en: "3. Open Staff Pro USA from the new icon and turn on notifications." },
];

export const TEXTO_BLOQUEADO = {
    es: "Toca el 🔒 junto a la dirección de la página → Notificaciones → Permitir, y recarga.",
    en: "Tap the 🔒 next to the page address → Notifications → Allow, then reload.",
};
