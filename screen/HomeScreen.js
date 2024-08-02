import { View, Text, Button, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-paper';
import { createTwoButtonAlert, getLoginUser, httpClient, url_api, url_sikeren_android } from '../constant/constant';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';

import { Alert } from 'react-native';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { useFocusEffect } from '@react-navigation/native';

import notifee from '@notifee/react-native';
import { openDatabase } from 'react-native-sqlite-storage';


const RNfirebaseConfig = {
    apiKey: "AIzaSyDBVHyNnj983q1f3o8nzYM1WBrwsk4hAyE",
    authDomain: "childe-78547.firebaseapp.com",
    projectId: "childe-78547",
    storageBucket: "childe-78547.appspot.com",
    messagingSenderId: ".....",
    appId: "......"
};

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';


function HomeScreen({ navigation }) {
    const [showBackdrop, setShowBackdrop] = useState(false);

    // ref
    const bottomSheetModalRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => [320], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        console.log("bottom sheet");
        bottomSheetModalRef.current?.present();
        setShowBackdrop(true);
    }, []);
    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        if (index == -1) {
            setShowBackdrop(false);
        }
    }, []);


    const [selectedBmnId, setSelectedBmnId] = useState(0);
    const [selectedBmn, setSelectedBmn] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [loginData, setLoginData] = useState(null);
    const [kegiatan, setKegiatan] = useState([]);
    const [history, setHistory] = useState([]);

    const getMovies = async () => {
        try {
            const response = await httpClient(url_api + "/records/bmns?size=5");
            const json = await response.json();
            setData(json.records);
            console.log("json movie", json.records);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const errorCB = (err) => {
        console.log("SQL Error: " + err);
    }
    
    const openCB = () => {
        console.log("Database OPENED");
    }

    const getHistory = async () => {
        let data = await getLoginUser();
        // console.error("TESSSS",data[0].nip);
        // console.log(data[0].kodeprovinsi);


        // https://sultradata.com/project/bmn-api/api.php/records/view_bmn_last_position?filter=niplama_other_pegawai,eq,340019247
        try {
            const response = await httpClient(url_api + `/records/view_bmn_last_position?filter=niplama_other_pegawai,eq,${data[0].nip}&filter=status,eq,2&order=created_at,asc`);
            let json = await response.json();

            let jsonArray = json.records;
            setHistory(jsonArray);
            console.log("json history", jsonArray);
            console.log(url_api + `/records/view_bmn_last_position?filter=niplama_other_pegawai,eq,${data[0].nip}&filter=status,eq,2&order=created_at,asc`);
            // alert(JSON.stringify(jsonArray));
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    }

    useEffect(() => {
        getMovies();
        firebase.initializeApp();
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log("NOTIFEEEEEEEEE FOREGROUNDDDDD");
            // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });
            console.log("remoteMessage", remoteMessage);
            // await notifee.displayNotification(JSON.parse(remoteMessage.data.notifee));
            // await notifee.displayNotification(remoteMessage.data);
            // await notifee.displayNotification(remoteMessage.data.notifee);
            let notif = remoteMessage.notification;
            notif.android.pressAction = {id : 'default'};
            await notifee.displayNotification(notif);

            // await notifee.displayNotification({
            //     title: 'Notification Title',
            //     body: 'Main body content of the notification',
            //     android: {
            //       channelId,
            //     //   smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            //       // pressAction is needed if you want the notification to open the app when pressed
            //       pressAction: {
            //         id: 'default',
            //       },
            //     },
            //   });
        });

        // var db = openDatabase({ name: 'childe.db', createFromLocation: 1 }, openCB, errorCB);
        // db.transaction(tx => {
        //     tx.executeSql("SELECT * FROM user WHERE id=1", [], (tx, results) => {
        //         const { rows } = results;
        //         let users = [];

        //         for (let i = 0; i < rows.length; i++) {
        //             users.push({
        //                 ...rows.item(i),
        //             });
        //         }

        //         console.log("users-bambbbbb");
        //         console.log(users[0].nip);
        //         if(users[0].nip!=null){
        //             setIsLogin(true);
        //         }else{
        //             setIsLogin(false);
        //         }


        //     })
        // });

        return unsubscribe;
    }, []);

    

    // useFocusEffect(
    //     React.useCallback(() => {
    //       (async()=>{
    //         console.log("FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM");
    //         const unsubscribe = messaging().onMessage(async remoteMessage => {
    //             Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //         });
    //         return unsubscribe
          
    //       })();
    //     }, [])
    //   );

    useFocusEffect(
        React.useCallback(() => {
          (async()=>{
            let data= await getLoginUser();
            console.log(data);
            if(data[0].email==null){
              setIsLogin(false);
              console.log("LOGIN FALSE");
            //   getHistory();
            }else{
              setIsLogin(true);
              setLoginData(data[0]);
              console.log("loginDataHome", data[0]);
            }

            //   https://sultradata.com/project/bmn-api/api.php/records/view_penugasan?filter=niplama,eq,340057159
            let response = await fetch(url_api + `/records/view_penugasan?filter=niplama,eq,${data[0].nip}&filter=start,nlt,${new Date().toISOString().slice(0, 10)}`);
            response = await response.json();
            //   console.log("Kegiatan", response.records[0].id_kegiatan);
            console.log("Link", url_api + `/records/view_penugasan?filter=niplama,eq,${data[0].nip}&filter=start,nlt,${new Date().toISOString().slice(0, 10)}`);

              //   let kegiatan = [];
              //   for (let index = 0; index < response.records.length; index++) {
              //     const element = response.records[index]["id_kegiatan"];
              //     kegiatan.push(element);
              //   }
            setKegiatan(response.records);
            console.log("kegiatan", response.records);
            getHistory();
          
          })();
        }, [])
      );

    return (

        //   <BottomSheetModalProvider>
        <View style={{ flex: 1, backgroundColor: "#e8e8e8" }}>
            <Card>
                <View style={{ width: "100%", height: 70, backgroundColor: "#2196f3", display: "flex", justifyContent: "center", padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* <Icon name="file-tree-outline" size={18} color="black" /> */}
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Dashboard</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Menu>
                            {/* <MenuTrigger text='Select action' /> */}
                            <MenuTrigger style={{marginRight: 20}}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon name="plus" size={18} color="white" />
                                </View>
                                {/* <TouchableOpacity style={{ flexDirection: "row", marginRight: 20, alignItems: "center" }} > */}
                                {/* </TouchableOpacity> */}
                            </MenuTrigger>
                            <MenuOptions style={{padding: 5}}>
                                <MenuOption onSelect={() => {navigation.navigate("Ckegiatan");}} text='Tambah Kegiatan' />
                                <MenuOption onSelect={() => {navigation.navigate("CRapat");}} text='Tambah Rapat' />
                            </MenuOptions>
                        </Menu>
                        {/* <TouchableOpacity style={{ flexDirection: "row", marginRight: 20, alignItems: "center" }} onPress={createTwoButtonAlert} >
                            <Icon name="plus" size={18} color="white" />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ flexDirection: "row", marginRight: 20, alignItems: "center" }} onPress={()=>{navigation.navigate("Camera");}} >
                            <Icon name="camera" size={18} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }} 
                            // onPress={createTwoButtonAlert}
                            onPress={() => {
                                navigation.navigate('Approve', {
                                    bmnId: 1,
                                });
                            }}  
                        >
                            <Icon name="bell" size={18} color="white" />
                        </TouchableOpacity>
                        {
                            history.length>0&&
                            <View style={{backgroundColor: "red", width:10, height:10, borderRadius: 5, position:"absolute", top: 0, right:0}}></View>
                        }
                    </View>
                </View>
            </Card>

            <ScrollView style={{ width: "100%", padding: 15 }}>
                <Text style={{ marginBottom: 10 }}>RAPAT / KEGIATAN</Text>
                <View 
                    style={{ backgroundColor: "white", width: "100%", marginBottom: 20, borderRadius: 10, padding: 10, display:kegiatan.length==0? "flex": "none" }}>
                    {/* <Icon name="pie-chart" size={16} color="black" />
                    <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>Total BMN BPS Sultra</Text> */}
                    <Image
                        style={{ width: 300, height: 300, alignSelf: "center", display: isLogin? "none": "flex" }} 
                        source={require("../images/go-pirate.png")}
                    />
                    <Image
                        style={{ width: 300, height: 300, alignSelf: "center", display: isLogin? "flex": "none" }} 
                        source={require("../images/go-mascot.png")} 
                    />
                    <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10, alignSelf: "center" }}>{isLogin?"Tidak ada rapat/kegiatan minggu ini":"Silahkan Login terlebih dahulu" }</Text>
                    {/* <Text>178 BMN</Text> */}
                </View>

                <View 
                    style={{ backgroundColor: "white", width: "100%", marginBottom: 20, borderRadius: 10, padding: 10, display:kegiatan.length>0? "flex": "none" }}>
                    {/* <Icon name="pie-chart" size={16} color="black" />
                    <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>Total BMN BPS Sultra</Text> */}
                    <Image
                        style={{ width: 300, height: 300, alignSelf: "center" }} 
                        source={require("../images/traefik2.png")}
                    />
                    <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10, alignSelf: "center" }}>{"Upcoming Meeting "+kegiatan[0]?.created_at }</Text>
                    <Button title='View All' onPress={()=>{navigation.navigate('Kegiatan')}} />
                    {/* <Text>178 BMN</Text> */}
                </View>



                {/* https://codesandbox.io/s/jeopt */}
                {/* <SafeAreaView style={{marginBottom: 20, height: 300}}>
                    <FlatList
                    data={kegiatan}
                    keyExtractor={(item) => item.id}
                    onEndReached={() => {}}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ width: "100%", backgroundColor: "white", display: "flex", 
                            justifyContent: "center", padding: 10, flexDirection: "row", justifyContent: "flex-start",
                            alignItems: "center", borderBottomWidth:1, borderBottomColor:"#e8e8e8" }} onPress={()=>{}} >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image
                                    style={{ width: 80, height: 80, alignSelf: "center" }}
                                    source={{ uri: 'https://sultradata.com/project/bmn-api/images/no_image.jpg'}}
                                />
                            </View>
                            <View style={{padding:10, flex: 1}}>
                                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 5, marginBottom: 10}}>{item.title}</Text>
                                <Text>{item.start}</Text>
                                <Text>{item.start_jam}</Text>
                            </View>
                        </TouchableOpacity>

                    )}
                    ListFooterComponent={
                        isLoading?
                        <View style={{height: 200, backgroundColor: "white"}}>
                        <ActivityIndicator size="large"  />
                        </View>:null
                    }
                    />
                </SafeAreaView> */}

                {/* <View style={{height: 500}}>
                {kegiatan.map((item, index) => (
                    <TouchableOpacity style={{ width: "100%", backgroundColor: "white", display: "flex", 
                    justifyContent: "center", padding: 10, flexDirection: "row", justifyContent: "flex-start",
                    alignItems: "center", borderBottomWidth:1, borderBottomColor:"#e8e8e8" }} onPress={()=>{}} >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image
                            style={{ width: 80, height: 80, alignSelf: "center" }}
                            source={{ uri: 'https://sultradata.com/project/bmn-api/images/no_image.jpg'}}
                        />
                    </View>
                    <View style={{padding:10, flex: 1}}>
                        <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 5, marginBottom: 10}}>{item.title}</Text>
                        <Text>{item.start}</Text>
                        <Text>{item.start_jam}</Text>
                    </View>
                </TouchableOpacity>
                ))}

                </View> */}




                <Text style={{ marginBottom: 10 }}>RECENT UPDATES</Text>
                {isLoading ? <ActivityIndicator size="large" /> : null}
                <ScrollView horizontal>
                    {data.map(function (row, i) {
                        // return <ObjectRow obj={object} key={i} />;
                        return <Card onPress={() => { handlePresentModalPress(); setSelectedBmnId(row.id); setSelectedBmn(row); }} style={{ backgroundColor: "white", width: 150, height: 200, marginBottom: 30, borderRadius: 10, padding: 10, marginRight: 10 }} key={i}>
                            {/* <Icon name="pie-chart" size={16} color="black" /> */}
                            <Image
                                style={{ width: 100, height: 100, alignSelf: "center" }}
                                source={{ uri: row.image_path == null ? 'https://sultradata.com/project/bmn-api/images/no_image.jpg' : 'https://sultradata.com/project/bmn-api/images/' + row.image_path }}
                            />
                            <Text>{row.kode_barang + "-" + row.nup}</Text>
                            <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>{row.merk}</Text>
                        </Card>;
                    })}
                </ScrollView>

            </ScrollView>

            {/* <ScrollView style={{padding: 10, flex: 1}}>
            <View style={{backgroundColor: "white", width: "100%", height: 100}}>
                <Text>Card 1</Text>
            </View>

            </ScrollView> */}
            {/* <Text>Home Screen</Text>
            <Button
            title="Go to Details"
            onPress={() => {
                console.log("wow");
                navigation.navigate('Details');}}
            />
            <Icon name="rocket" size={30} color="#900" /> */}
            <Portal>
                {showBackdrop ? <TouchableOpacity style={{ backgroundColor: "black", opacity: 0.5, position: "absolute", top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%" }}
                    activeOpacity={0.5}
                    onPress={() => { bottomSheetModalRef.current?.dismiss(); console.log("Backdrop pressed"); }}></TouchableOpacity>
                    : null}
                <BottomSheetModalProvider>
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                    >
                        <View style={styles.contentContainer}>
                            {/* <Text>Awesome 🎉</Text> */}
                            <View style={{ flexDirection: "row", marginBottom: 20, alignItems: "center", borderColor: "#e8e8e8", borderBottomWidth: 1, height: 90, paddingHorizontal: 20 }}>
                                <Image
                                    style={{ width: 70, height: 70, alignSelf: "center", borderColor: "#e8e8e8", borderWidth: 1 }}
                                    source={{ uri: selectedBmn.image_path == null ? 'https://sultradata.com/project/bmn-api/images/no_image.jpg' : 'https://sultradata.com/project/bmn-api/images/' + selectedBmn.image_path }}
                                />
                                <View style={{ paddingHorizontal: 10, flex: 1 }}>
                                    <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>{selectedBmn.merk}</Text>
                                    <Text>{selectedBmn.kode_barang + "-" + selectedBmn.nup}</Text>
                                </View>
                            </View>

                            <View style={{ paddingHorizontal: 20 }}>

                                <TouchableOpacity style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }}
                                    onPress={() => {
                                        bottomSheetModalRef.current?.dismiss();
                                        navigation.navigate('Details', {
                                            bmnId: selectedBmnId,
                                        });
                                    }}
                                >
                                    <View style={{ width: 20 }}>
                                        <Icon name="eye" size={16} color="black" />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 10 }}>Details</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }}
                                    onPress={() => {
                                        bottomSheetModalRef.current?.dismiss();
                                        navigation.navigate('History', {
                                            bmnId: selectedBmnId,
                                        });
                                    }}  
                                >
                                    <View style={{ width: 20 }}>
                                        <Icon name="history" size={16} color="black" />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 10 }}>History</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }} 
                                    onPress={() => {
                                        bottomSheetModalRef.current?.dismiss();
                                        navigation.navigate('Claim', {
                                            bmnId: selectedBmnId,
                                        });
                                    }}
                                >
                                    <View style={{ width: 20 }}>
                                        <Icon name="camera" size={16} color="black" />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 10 }}>Claim BMN</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }} onPress={createTwoButtonAlert} >
                                    <View style={{ width: 20 }}>
                                        <Icon name="image" size={16} color="black" />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 10 }}>Add Photo from Gallery</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }} 
                                    onPress={() => {
                                        bottomSheetModalRef.current?.dismiss();
                                        navigation.navigate('Transfer', {
                                            bmnId: selectedBmnId,
                                        });
                                    }} 
                                
                                >
                                    <View style={{ width: 20 }}>
                                        <Icon name="truck" size={16} color="black" />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 10 }}>Transfer BMN</Text>
                                </TouchableOpacity>
                            </View>



                        </View>
                    </BottomSheetModal>

                </BottomSheetModalProvider>

            </Portal>
        </View>


        //{/* </BottomSheetModalProvider> */}
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        //   padding: 20
        //   alignItems: 'center',
    },
});

export default HomeScreen
