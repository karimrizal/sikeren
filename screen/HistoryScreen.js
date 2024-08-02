import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getLoginUser, httpClient, url_api } from '../constant/constant';
import { Picker } from '@react-native-picker/picker';

function HistoryScreen({ route, navigation }) {
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
    // let data= await getLoginUser();
    // console.log(data[0].kodeprovinsi);


    // https://sultradata.com/project/bmn-api/api.php/records/view_history?filter=id_bmn,eq,28257
    try {
      const response = await httpClient(url_api + `/records/view_history?filter=id_bmn,eq,${bmnId}&order=created_at,asc`);
      let json = await response.json();

      let jsonArray = json.records;
      setHistory(jsonArray);
      console.log("json history", jsonArray);
      console.log(url_api + `/records/view_history?filter=id_bmn,eq,${bmnId}&order=id,asc`);
      // alert(JSON.stringify(jsonArray));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>History {bmnId}</Text>
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
                <Text>{"History BMN :"}</Text>
                {history.length==0 &&
                  <Text style={{color: "black", fontWeight: "bold", fontSize:15, marginTop: 10, marginBottom: 10}}>{"BMN berikut belum pernah diclaim!"}</Text>
                }

                {history.map((item, index) => (
                  <View key={item.id}>
                    <View style={{width: "100%", backgroundColor: "#F3D7CA", marginTop: 10, marginBottom: 10, padding:10}}>
                      <Text>{tupleStatus[item.status]}</Text>
                      <View style={{flexDirection: "row"}}>
                        <Text>{item.nama_awal}</Text>
                        {item.nama_transfer != null &&
                          <Text>{" -> "+item.nama_transfer}</Text>
                        }
                      </View>
                      <View style={{justifyContent: "flex-end", flexDirection: "row"}}>
                        <Text style={{color: "black", fontWeight: "bold", marginTop: 10}}>{item.created_at}</Text>
                      </View>
                    </View>
                    {(history.length-1) != index &&
                      <View style={{ justifyContent: "center", flexDirection: "row" }}>
                        {/* <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>↓</Text> */}
                        <Icon name="arrow-down" size={16} color="black" />
                      </View>
                    }



                  </View>
                ))}
              </View>
            </View>


            
          </ScrollView>



        </View>
      </View>
    );
  }

export default HistoryScreen