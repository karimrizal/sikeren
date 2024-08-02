/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { getGoogleToken } from './constant/constant';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // notifee.displayNotification(JSON.parse(remoteMessage.data.notifee));
    // notifee.onBackgroundEvent()
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });
    // await notifee.displayNotification(JSON.parse(remoteMessage.data.notifee));
    
    // await notifee.displayNotification(remoteMessage.notification);
    let notif = remoteMessage.notification;
    notif.android.pressAction = {id : 'default'};
    await notifee.displayNotification(notif);


});

// async function onAppBootstrap() {
//     // Register the device with FCM
//     await messaging().registerDeviceForRemoteMessages();
  
//     // Get the token
//     const token = await messaging().getToken();
  
//     // Save the token
//     // await postToApi('/users/1234/tokens', { token });
//     console.log("tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
//     console.log(token);
// }
// onAppBootstrap();
getGoogleToken();

AppRegistry.registerComponent(appName, () => App);
