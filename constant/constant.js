import { Alert } from "react-native";
import { enablePromise, openDatabase } from 'react-native-sqlite-storage';
import messaging from '@react-native-firebase/messaging';

export const url_api = "https://sultradata.com/project/bmn-api/api.php";
export const url_sikeren_android = "https://sultradata.com/project/sikeren-android-api/api.php";
export const url_notify = "https://sultradata.com/project/sikeren-android-api/notify.php";
export const url_notify_bmn = "https://sultradata.com/project/sikeren-android-api/notify-bmn.php";
export const url_pegawai = "https://webapps.bps.go.id/sultra/sikeren/pegawai.php";

export const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    let jwt = ""
    // let storage = localStorage.getItem("sbm-auth");
    // if (storage !== null) {
    //     let temp = JSON.parse(storage);
    //     jwt = temp.jwt;
    // }
    // options.headers.set('X-Authorization', 'Bearer '+"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUSEVfSVNTVUVSIiwiYXVkIjoiVEhFX0FVRElFTkNFIiwiaWF0IjoxNjU4NzIwMzY3LCJuYmYiOjE2NTg3MjAzNjgsImV4cCI6MTY1ODcyNzU2NywiZGF0YSI6eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IjEiLCJrb2RlX3dpbGF5YWgiOiI3NDAyIn19.QNkbwcSoiS1jStZvEd7M6in4zHY6eblhlcfPRWQ6yPQ");
    options.headers.set('X-Authorization', 'Bearer ' + jwt);
    return fetch(url, options);
};

export const createTwoButtonAlert = () =>
    Alert.alert(
        "Warning",
        "Feature not implemented yet",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
    );

export const bmnAlert = (message) =>
    Alert.alert(
        "Warning",
        message,
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
    );

const errorCB = (err) => {
    console.log("SQL Error: " + err);
}

const successCB = () => {
    console.log("SQL executed fine");
}

const openCB = () => {
    console.log("Database OPENED");
}

const closeCB = () => {
    console.log("Database CLOSED");
}

// const closeDatabase = (db) => {
//     if (db) {
//         console.log("Closing database ...");
//         this.updateProgress("Closing database");
//         db.close(this.closeCB,this.errorCB);
//     } else {
//         this.updateProgress("Database was not OPENED");
//     }
// };

export const getLoginUser = async () => {
    // enablePromise(true);
    return new Promise((resolve, reject) => {
        // var db = openDatabase("childe.db", "1.0", "Childe Database", 200000, openCB, errorCB);
        // var db = openDatabase("childe.db", "1.0", "Childe Database", 200000, openCB, errorCB);
        var db = openDatabase({ name: 'childe.db', createFromLocation: 1 }, openCB, errorCB);
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM user WHERE id=1", [], (tx, results) => {
                const { rows } = results;
                let users = [];

                for (let i = 0; i < rows.length; i++) {
                    users.push({
                        ...rows.item(i),
                    });
                }

                console.log(users);

                resolve(users);

            })
        }, reject);
        // db.close(closeCB, errorCB);
    });
}


export const deleteLoginUSer = async () => {
    var db = openDatabase({ name: 'childe.db', createFromLocation: 1 }, openCB, errorCB);
    await db.transaction((tx) => {
        tx.executeSql(
            'UPDATE user set email=?, eselon=?, foto=?, golongan=?, jabatan=?, kodekabupaten=?, kodeorganisasi=?, kodeprovinsi=?, nama=?, nip=?, nipbaru=?, token=?, username=? where id=1',
            [null, null, null, null, null, null, null, null, null, null, null, null, null],
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                    console.log("Update DB Success");
                    // setShowDialog(false);
                } else console.log('Update DB Failed');
            }
        );
    });
}

export const getGoogleToken = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();
  
    // Get the token
    const token = await messaging().getToken();
  
    // Save the token
    // await postToApi('/users/1234/tokens', { token });
    console.log("tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    console.log(token);
    return token;
}