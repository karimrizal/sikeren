import { View, Text, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { httpClient, url_api, url_pegawai } from '../constant/constant';

function DetailKegiatanScreen({ route, navigation }) {
  const { bmnId } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [peserta, setPeserta] = useState(null);

  const getBmn = async () => {
    try {
      const response = await httpClient(url_api + `/records/kegiatans/${bmnId}?join=penugasans`);
      const json = await response.json();
      setData(json);
      console.log("json bmn", json);
      // console.log(url_api + `/records/kegiatans/${bmnId}?join=penugasans`);

      const response2 = await httpClient(url_pegawai);
      const json2 = await response2.json();
      // console.log("json2", json2);
      
      let temp = [];
      for (let index = 0; index < json2.length; index++) {
        const element = json2[index];
        let pegawai = {
          id: element["attributes"]["attribute-nip-lama"][0],
          name: element["attributes"]["attribute-nama"][0]
        }
        temp.push(pegawai);
      }

      let penugasans = json.penugasans;
      console.log("penugasans", penugasans);

      let peserta = temp.filter((arrayEl) =>
        penugasans.some((filterEl) => filterEl.niplama == arrayEl.id)
      );

      console.log("peserta", peserta);
      setPeserta(peserta);

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
            <TouchableOpacity onPress={() => { navigation.goBack(); }} >
              <Icon name="arrow-left" size={18} color="black" />
            </TouchableOpacity>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Detail Kegiatan {bmnId}</Text>
          </View>
        </View>
      </Card>

      <View style={{ flex: 1 }}>
        {isLoading ? <ActivityIndicator size="large" /> : null}
        <ScrollView>
          <Image
            resizeMode={'stretch'}
            style={{ width: '100%', height: 250 }}
            source={require("../images/workshop.png")}
          />
          <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: "#e8e8e8", backgroundColor: "white" }}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginTop: 10, marginBottom: 10 }}>{data?.title}</Text>
            <Text>{data?.agenda}</Text>
          </View>

          <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: "#e8e8e8", backgroundColor: "white", flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              <Text>{"Lokasi"}</Text>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>{data?.tempat}</Text>
            </View>
            <View style={{ width: "50%", paddingLeft: 10 }}>
              <Text>{"Created At"}</Text>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>{data?.created_at == null ? "-" : data?.created_at}</Text>
            </View>
          </View>

          <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: "#e8e8e8", backgroundColor: "white", flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              <Text>{"Waktu mulai"}</Text>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>{data?.start + " " + data?.start_jam}</Text>
            </View>
            <View style={{ width: "50%", paddingLeft: 10 }}>
              <Text>{"Waktu selesai"}</Text>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>{data?.end + " " + data?.end_jam}</Text>
            </View>
          </View>

          <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: "#e8e8e8", backgroundColor: "white", flexDirection: "row" }}>
            <View style={{ width: "100%" }}>
              <Text>{"Pemimpin Rapat"}</Text>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>{data?.pemimpin}</Text>
            </View>
          </View>
          <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: "#e8e8e8", backgroundColor: "white", flexDirection: "row" }}>
            <View style={{ width: "100%" }}>
              <Text>{"Peserta Rapat"}</Text>
              <FlatList
                data={peserta}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10, marginBottom: 10 }}>{"-"}{item.name}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>



      </View>
    </View>
  );
}

export default DetailKegiatanScreen