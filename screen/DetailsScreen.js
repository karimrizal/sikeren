import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { httpClient, url_api } from '../constant/constant';

function DetailsScreen({ route, navigation }) {
  const { bmnId } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);

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

  useEffect(() => {
    getBmn();
  }, []);
  

    return (
      <View style={{ flex: 1 }}>
        <Card>
          <View style={{ width: "100%", height: 70, backgroundColor: "white", display: "flex", justifyContent: "center", padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={()=>{navigation.goBack();}} >
                <Icon name="arrow-left" size={18} color="black" />
              </TouchableOpacity>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Details {bmnId}</Text>
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
                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.claimed_by==null?"-":data?.claimed_by}</Text>
              </View>
            </View>
            
            <View style={{padding: 15, borderBottomWidth:1, borderBottomColor:"#e8e8e8", backgroundColor: "white", flexDirection: "row"}}>
              <View style={{width: "100%"}}>
                <Text>{"Kondisi"}</Text>
                <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{data?.kondisi}</Text>
              </View>
            </View>
          </ScrollView>



        </View>
      </View>
    );
  }

export default DetailsScreen