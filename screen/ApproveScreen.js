import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getLoginUser, httpClient, url_api } from '../constant/constant';
import { Picker } from '@react-native-picker/picker';
import MyButton from './components/MyButton';

function ApproveScreen({ route, navigation }) {
  const { bmnId } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const tupleStatus = { 
    0: '-', 
    1: '[First Claim]', 
    2: '[Transfer]', 
    3: '[Terima]', 
    4: '[Tolak]', 
    5: '[Permintaan Perbaikan BMN]', 
  };

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

  const getHistory = async () => {
    let data= await getLoginUser();
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
      setLoading(false);
    }
  }

  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const approve = async (item) => {

    let loginData= await getLoginUser();
    console.log("loginData", loginData[0].nip);

    // Data to be sent in the POST request as JSON
    const data = {
      id_bmn: item.id_bmn,
      niplama: loginData[0].nip,
      status: 3
    };

    try {
      const response = await postData(url_api+`/records/history_bmn`, data);
      console.log('Success:', response);

      Alert.alert("Notifikasi", "Penolakan BMN berhasil, status kepemilikan BMN kembali ke pemilik BMN awal!");
    } catch (error) {
      console.error('Error:', error);
    } finally{
      getHistory();
    }

    // // Make a POST request to the API
    // // https://sultradata.com/project/bmn-api/api.php/records/history_bmn
    // fetch(url_api+`/records/history_bmn`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // You might need additional headers here, depending on the API requirements
    //     // For example, you might include an authorization token
    //     // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    //   },
    //   body: JSON.stringify(postData)
    // })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     console.log(data); // Process the response data
    //     Alert.alert("Notifikasi", "Approval BMN berhasil, status kepemilikan BMN telah berpindah ke akun ini!");
    //     //add notifee here
    //   })
    //   .catch(error => {
    //     console.error('Fetch error:', error);
    //   })
    //   .finally(() => {
    //     getHistory();
    //   });


  }


  const reject = async (item) => {
    let loginData= await getLoginUser();
    const postData1 = {
      id_bmn: item.id_bmn,
      niplama: loginData[0].nip,
      status: 4
    };

    const postData2 = {
      id_bmn: item.id_bmn,
      niplama: item.niplama,
      status: 3
    };

    try {
      const response1 = await postData(url_api+`/records/history_bmn`, postData1);
      console.log('Success:', response1);

      const response2 = await postData(url_api+`/records/history_bmn`, postData2);
      console.log('Success:', response2);
      Alert.alert("Notifikasi", "Penolakan BMN berhasil, status kepemilikan BMN kembali ke pemilik BMN awal!");
    } catch (error) {
      console.error('Error:', error);
    } finally{
      getHistory();
    }
    
  }


  useEffect(() => {
    getBmn();
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
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Notifications</Text>
            </View>
          </View>
        </Card>

        <View style={{flex: 1}}>
          {isLoading ? <ActivityIndicator size="large" /> : null}
          <ScrollView>
            {/* <Image
              resizeMode={'stretch'}
              style={{ width: '100%', height: 250 }}
              source={{ uri: data?.image_path==null? 'https://sultradata.com/project/bmn-api/images/no_image.jpg':'https://sultradata.com/project/bmn-api/images/'+data.image_path }}
            />
            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white"}}>
              <Text>{data?.kode_barang+"-"+data?.nup}</Text>
              <Text style={{color: "black", fontWeight: "bold", fontSize:20, marginTop: 10, marginBottom: 10}}>{data?.merk}</Text>
            </View> */}

            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white", flexDirection: "row"}}>
              <View style={{width: "100%"}}>
                <Text>{"Approval transfer BMN :"}</Text>
                {history.length==0 &&
                  <Text style={{color: "black", fontWeight: "bold", fontSize:15, marginTop: 10, marginBottom: 10}}>{"Tidak ada transfer barang BMN ke akun anda!"}</Text>
                }

                {history.map((item, index) => (
                  <View key={item.id}>
                    <View style={{width: "100%", backgroundColor: "#BEADFA", marginTop: 10, marginBottom: 10, padding:10}}>
                      <Text>{tupleStatus[item.status]}</Text>
                      <Text>{item.nama_barang+" : "+item.merk}</Text>
                      <View style={{flexDirection: "row"}}>
                        <Text>{item.nama_awal}</Text>
                        {item.nama_transfer != null &&
                          <Text>{" -> "+item.nama_transfer}</Text>
                        }
                      </View>
                      <View style={{justifyContent: "flex-end", flexDirection: "row"}}>
                        <Text style={{color: "black", fontWeight: "bold", marginTop: 10}}>{item.created_at}</Text>
                      </View>
                      <View style={{flexDirection: "row", marginTop: 15}}>
                        {/* <Button style={{width: "50%"}} color="#FFB996" mode="contained" onPress={() => reject(item)}>
                          Tolak
                        </Button> */}

                        {/* <MyButton 
                          style={{width: "50%"}}
                          // style={{ backgroundColor: 'red', borderRadius: 10 }} 
                          color="#FFB996" mode="contained"
                          onClick={() => reject(item)}
                          buttonText="Tolak"
                        /> */}
                        <MyButton
                          color="#FFB996" mode="contained"
                          onClick={() => reject(item)}
                          buttonText="Tolak"
                        />
                        {/* <Button style={{width: "50%"}} color="#D9EDBF" mode="contained" onPress={() => approve(item)}>
                          Terima
                        </Button> */}
                        <MyButton
                          color="#D9EDBF" mode="contained"
                          onClick={() => approve(item)}
                          buttonText="Terima"
                        />

                      </View>
                    </View>
                    {/* {(history.length-1) != index &&
                      <View style={{ justifyContent: "center", flexDirection: "row" }}>
                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>↓</Text>
                      </View>
                    } */}



                  </View>
                ))}
              </View>
            </View>


            
          </ScrollView>



        </View>
      </View>
    );
  }

export default ApproveScreen