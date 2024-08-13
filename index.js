import "react-native-reanimated"
import { AppRegistry, LogBox, Platform } from "react-native";
import App from "./src/App";
import { name as appName } from "./package.json";



import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidStyle, AndroidGroupAlertBehavior } from '@notifee/react-native';
import Firebase from "./src/Firebase";
import Config from "./src/Config";
import { SDate } from "servisofts-component";

const sendNotificationEvent = async (notification) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "service": "notification",
        "component": "notification",
        "type": "event",
        "event": "show_in_device",
        "fecha": new SDate().toString("yyyy-MM-dd hh:mm:ss"),
        "estado": "cargando",
        "notification": notification
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://casagrande.servisofts.com/images/api", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
const BuildNotification = async (notification) => {
    console.log("llego la notificacionnnnnnn  ", notification)
    sendNotificationEvent(notification);
    const displayedNotifications = await notifee.getDisplayedNotifications();
    const groupId = "casa_grande";
    const isSummaryAlreadyDisplayed = displayedNotifications.some(notif =>
        notif.android?.groupId === groupId && notif.android?.groupSummary
    );
    Firebase.setBadgeCount(displayedNotifications.length + 1);
    // console.log("ENTRO NCACCAK SCKA CKS ")
    // console.log(displayed)
    const subtitle = "Casa Grande"
    if (!isSummaryAlreadyDisplayed && Platform.OS == "android") {
        await notifee.displayNotification({
            id: groupId,
            // title: notification?.data?.razon_social,
            subtitle: subtitle,
            android: {
                channelId: "default_channel_id",
                smallIcon: 'notification_round', // optional, defaults to 'i
                color: "#ffffff",
                groupSummary: true,
                groupId: groupId,
            },
        });
    }


    // return;
    let notify = {
        title: notification?.data?.title,
        subtitle: subtitle,
        // title: notification?.data?.title,
        body: notification?.data?.body,
        data: notification?.data,
        ios: {
            attachments: [

            ]
        },
        android: {
            channelId: "default_channel_id",
            // groupSummary: true,
            // tag: notification?.data?.key_empresa,
            // category: notification?.data?.key_empresa,
            groupId: groupId,
            smallIcon: 'notification_round', // optional, defaults to 'ic_launcher'.
            color: "#ffffff",
            // largeIcon: notification?.data?.image,

            pressAction: {
                id: 'default'
            }
        },
    }
    if (notification?.data?.image) {
        notify.android.largeIcon = notification?.data?.image;
        notify.ios.attachments.push({ url: notification?.data?.image });
    }
    await notifee.displayNotification(notify);
}
const unsubscribe = messaging().onMessage(async remoteMessage => {
    await BuildNotification(remoteMessage);
});


messaging().setBackgroundMessageHandler(async remoteMessage => {
    await BuildNotification(remoteMessage);
});


LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['AsyncStorage', 'Animated:', 'VirtualizedList:', 'VirtualizedLists', "Animated.event", "Warning: Each child in a list ", "Invalid", "Require cycle"])
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
