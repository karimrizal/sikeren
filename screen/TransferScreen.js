import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getLoginUser, httpClient, url_api, url_notify, url_notify_bmn } from '../constant/constant';
import { Picker } from '@react-native-picker/picker';

function TransferScreen({ route, navigation }) {
  const { bmnId } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [pegawai, setPegawai] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedPegawaiAwal, setSelectedPegawaiAwal] = useState();
  const [selectedPegawaiTujuan, setSelectedPegawaiTujuan] = useState();

  const [history, setHistory] = useState([]);

  const getBmn = async () => {
    try {
      const response = await httpClient(url_api + `/records/bmns/${bmnId}`);
      const json = await response.json();
      setData(json);
      console.log("json bmn", json);
      console.log(url_api + `/records/bmns/${bmnId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getPegawai = async () => {
    let data= await getLoginUser();
    console.log(data[0].kodeprovinsi);
            // if(data[0].email==null){
    // alert(data[0].kodeprovinsi+data[0].kodekabupaten);


    try {
      const response = await httpClient(url_api + `/records/view_pegawai?filter=id_satker,eq,${data[0].kodeprovinsi+data[0].kodekabupaten}&order=nama_lengkap,asc`);
      let json = await response.json();
      // console.log(url_api + `/records/users_jabatan?filter=id_satker,eq,${data[0].kodeprovinsi+data[0].kodekabupaten}&join=users`);
      // console.error("json", json);

      let jsonArray = json.records;
      // console.log(jsonArray);
      // jsonArray.sort((a, b) => {
      //   const nameA = a.id_users.nama_lengkap.toUpperCase(); // ignore upper and lowercase
      //   const nameB = b.id_users.nama_lengkap.toUpperCase(); // ignore upper and lowercase
      
      //   if (nameA < nameB) {
      //     return -1;
      //   }
      //   if (nameA > nameB) {
      //     return 1;
      //   }
      
      //   // names must be equal
      //   return 0;
      // });
      setPegawai(jsonArray);
      console.log("json bmn", jsonArray);
      console.log(url_api + `/records/users_jabatan?filter=id_satker,eq,${data[0].kodeprovinsi+data[0].kodekabupaten}&join=users`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const sendPushMessage = async (niplama) =>{
    console.log("url notify", url_notify_bmn);
    //notify api here
    let data3 = {
      message_title: "SIKEREN BMN",
      message_content: "Terdapat transfer BMN ke akun anda, mohon melakukan approval/reject!",
      niplama_tujuan: niplama
    }

    fetch(url_notify_bmn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data3)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        // Process the JSON data
        console.log("DATA NOTIFEE", data);
        // Alert.alert(
        //   "Success",
        //   "Berhasil menambahkan kegiatan",
        //   [
        //     { text: "OK", onPress: () => navigation.navigate("Home") }
        //   ]
        // );
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
        // Alert.alert(
        //   "Warning",
        //   "Gagal menambahkan kegiatan",
        //   [
        //     { text: "OK", onPress: () => console.log(error) }
        //   ]
        // );
      }).finally(() => {
        // setIsLoading(false);
      });


  }

  const submit = async () =>{
    console.log("SSSSUBMIT");
    let loginData= await getLoginUser();
    console.log("loginData", loginData[0].nip);

    if(loginData[0].nip!=selectedPegawaiAwal){
      Alert.alert("Error, Gagal Transfer", "Login user berbeda dengan pemegang BMN saat ini, lihat history BMN untuk melihat pemegang saat ini");
      return;



    }

    // Data to be sent in the POST request as JSON
    const postData = {
      id_bmn: bmnId,
      niplama: selectedPegawaiAwal,
      niplama_other_pegawai: selectedPegawaiTujuan,
      status: 2
    };

    // Make a POST request to the API
    https://sultradata.com/project/bmn-api/api.php/records/history_bmn
    fetch(url_api+`/records/history_bmn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You might need additional headers here, depending on the API requirements
        // For example, you might include an authorization token
        // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
      },
      body: JSON.stringify(postData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Process the response data
        Alert.alert("Notifikasi", "Transfer BMN berhasil, menunggu persetujuan pihak terkirim");
        //add notifee here
        sendPushMessage(selectedPegawaiTujuan);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
      
  }

  const getHistory = async () => {
    // let data= await getLoginUser();
    // console.log(data[0].kodeprovinsi);


    // https://sultradata.com/project/bmn-api/api.php/records/view_history?filter=id_bmn,eq,28257
    try {
      const response = await httpClient(url_api + `/records/view_history?filter=id_bmn,eq,${bmnId}&filter=status,neq,4&order=created_at,desc`);
      let json = await response.json();

      let jsonArray = json.records;
      setHistory(jsonArray);
      console.log("json history", jsonArray);
      console.log(url_api + `/records/view_history?filter=id_bmn,eq,${bmnId}&filter=status,neq,4&order=created_at,desc`);
      // alert(JSON.stringify(jsonArray));

      if(jsonArray.length>0){
        setSelectedPegawaiAwal(jsonArray[0].niplama);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBmn();
    getPegawai();
    getHistory();
  }, []);
  

    return (
      <View style={{ flex: 1 }}>
        <Card>
          <View style={{ width: "100%", height: 70, backgroundColor: "white", display: "flex", justifyContent: "center", padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={()=>{navigation.goBack();}} >
                <Icon name="arrow-left" size={18} color="black" />
              </TouchableOpacity>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Transfer {bmnId}</Text>
            </View>
          </View>
        </Card>

        <View style={{flex: 1}}>
          {isLoading ? <ActivityIndicator size="large" /> : null}
          <ScrollView>
            <Image
              resizeMode={'stretch'}
              style={{ width: '100%', height: 250 }}
              source={{ uri: data?.image_path==null? 'https://sultradata.com/project/bmn-api/images/no_image.jpg':'https://sultradata.com/project/bmn-api/images/'+data.image_path }}
            />
            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white"}}>
              <Text>{data?.kode_barang+"-"+data?.nup}</Text>
              <Text style={{color: "black", fontWeight: "bold", fontSize:20, marginTop: 10, marginBottom: 10}}>{data?.merk}</Text>
            </View>

            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white", flexDirection: "row"}}>
              <View style={{width: "100%"}}>
                <Text>{"Pemegang BMN saat ini"}</Text>
                {/* {pegawai != null &&
                  <Text>{"Test if"}</Text>
                } */}
                <Picker
                  style={{borderColor: "red"}}
                  selectedValue={selectedPegawaiAwal}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedPegawaiAwal(itemValue)
                  }
                  enabled={false}
                  
                >
                  {history.map((item) => (
                    <Picker.Item label={item.nama_awal} value={item.niplama} />
                  ))}
                  {/* <Picker.Item label="Java" value="java" /> */}
                  {/* <Picker.Item label="JavaScript" value="js" /> */}
                </Picker>
                {/* <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.kondisi}</Text> */}
              </View>
            </View>

            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white", flexDirection: "row"}}>
              <View style={{width: "100%"}}>
                <Text>{"Transfer ke"}</Text>
                <Picker
                  style={{borderColor: "red"}}
                  selectedValue={selectedPegawaiTujuan}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedPegawaiTujuan(itemValue)
                  }
                >
                  {pegawai.map((item) => (
                    <Picker.Item label={item.nama_lengkap} value={item.niplama} />
                  ))}
                  {/* <Picker.Item label="Java" value="java" /> */}
                  {/* <Picker.Item label="JavaScript" value="js" /> */}
                </Picker>
                {/* <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.kondisi}</Text> */}
                <Button icon="send" mode="contained" onPress={()=>{submit();}} >Submit</Button>
              </View>
            </View>

            
            {/* <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white", flexDirection: "row"}}>
              <View style={{width: "50%"}}>
                <Text>{"Lokasi"}</Text>
                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.nama_ruangan}</Text>
              </View>
              <View style={{width: "50%", paddingLeft: 10}}>
                <Text>{"Updated At"}</Text>
                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.data_updated==null?"-":data?.data_updated}</Text>
              </View>
            </View>
            
            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white", flexDirection: "row"}}>
              <View style={{width: "50%"}}>
                <Text>{"Price"}</Text>
                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{"Rp. "+data?.harga_barang?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
              </View>
              <View style={{width: "50%", paddingLeft: 10}}>
                <Text>{"Pemegang BMN"}</Text>
                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.pemegang==""?"-":data?.pemegang}</Text>
              </View>
            </View>
            
            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white", flexDirection: "row"}}>
              <View style={{width: "100%"}}>
                <Text>{"Kondisi"}</Text>
                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.kondisi}</Text>
              </View>
            </View> */}
          </ScrollView>



        </View>
      </View>
    );
  }

export default TransferScreen