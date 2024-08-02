import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createTwoButtonAlert, deleteLoginUSer, getLoginUser } from '../constant/constant';
import { useFocusEffect } from '@react-navigation/native';

(async()=>{
  let data= await getLoginUser();
  console.log(data);

})()

function SettingScreen({ navigation }) {
    let [isLogin, setIsLogin] = useState(false);
    let [loginData, setLoginData] = useState(null);
    // useFocusEffect(() => {
    //   console.log("USE FOCUS EFFECT EXECUTED");
    //   (async()=>{
    //     let data= await getLoginUser();
    //     console.log(data);
    //     if(data[0].email==null){
    //       setIsLogin(false);
    //     }else{
    //       setIsLogin(true);
    //     }
      
    //   })();


    // }, []);

    useFocusEffect(
      React.useCallback(() => {
        (async()=>{
          let data= await getLoginUser();
          console.log("USE FOCUS EFFECT");
          console.log(data);
          if(data[0].email==null){
            setIsLogin(false);
          }else{
            console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
            setIsLogin(true);
            setLoginData(data[0]);
            console.log("loginData", loginData);
          }
        
        })();
      }, [])
    );



    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView>
          <View style={{width: "100%", height: 180, backgroundColor: "white", alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#e8e8e8"}}>
            <View style={{width:60, height: 60, backgroundColor: "#e8e8e8", borderRadius: 30, justifyContent: "center", alignItems: "center"}}>
              <Text style={{color: "black", fontWeight: "bold", fontSize:16}}>{isLogin? loginData?.nama.substring(0,1) : "?"}</Text>
            </View>
            <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{isLogin? loginData?.nama : "Silahkan login terlebih dahulu"}</Text>
            <Text>{isLogin? loginData?.email : "-"}</Text>
            <Text>{isLogin? loginData?.niplama : "-"}</Text>
          </View>

          <TouchableOpacity style={{flexDirection: "row", paddingVertical: 20, paddingLeft: 20, height: 60}} onPress={createTwoButtonAlert}>
            <Icon name="account-details-outline" size={20} color="black" />
            <View style={{marginLeft: 20, borderBottomWidth:1, borderBottomColor: "#e8e8e8", flex:1, height: 40, paddingRight: 20 }}>
              <Text style={{color: "black"}}>Rincian BMN Saya</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: "row", paddingVertical: 20, paddingLeft: 20, height: 60, display: !isLogin? "flex":"none"}} onPress={()=>{navigation.navigate("Login");}}>
            <Icon name="login" size={20} color="black" />
            <View style={{marginLeft: 20, borderBottomWidth:1, borderBottomColor: "#e8e8e8", flex:1, height: 40, paddingRight: 20 }}>
              <Text style={{color: "black"}}>Sign In</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: "row", paddingVertical: 20, paddingLeft: 20, height: 60, marginBottom: 20, display: isLogin? "flex":"none"}} onPress={()=>{deleteLoginUSer(); setIsLogin(false); setLoginData(null);}}>
            <Icon name="logout" size={20} color="black" />
            <View style={{marginLeft: 20, borderBottomWidth:1, borderBottomColor: "#e8e8e8", flex:1, height: 40, paddingRight: 20 }}>
              <Text style={{color: "black"}}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

      </View>
    );
  }

export default SettingScreen