import { View, Text, Button, Image, SafeAreaView, FlatList, ActivityIndicator, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import { createTwoButtonAlert, getLoginUser, httpClient, url_api, url_sikeren_android } from '../constant/constant';
import { Portal } from '@gorhom/portal';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CustomBackdrop from '../constant/CustomBackDrop';
import { useFocusEffect } from '@react-navigation/native';

import TimeAgo from 'javascript-time-ago'

// Indonesia.
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en);


const getTimeAgo = (start_date) =>{
  if(start_date){
    // Create formatter (English).
    const timeAgo = new TimeAgo('en-US')
    return timeAgo.format(Date.parse(start_date));
  }
  return null;

}


// const MAX_BMNS = 50;
const INITIAL_BMNS_COUNT = 10;
const FETCH_BMNS_COUNT = 10;


function KegiatanScreen({ navigation }) {
  const [bmns, setBmns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [MAX_BMNS, setMaxBMN] = useState(50);
  const [showSearch, setShowSearch] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => [250], []);

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

  const fetchBmns = async (length, count, page) => {
    if (length >= MAX_BMNS) return;
    if (isLoading && length > 0) return;
    if (!isLoading) await setIsLoading(true);

    try {
      // let url = url_api+"/records/bmns?"+`page=${page},${count}`;
      let data= await getLoginUser();
      // let url = url_sikeren_android + `/records/penugasans?filter=niplama,eq,${data[0].nip}&join=kegiatans` + `page=${page},${count}`;
      let url = url_sikeren_android + `/records/penugasans?filter=niplama,eq,${data[0].nip}&join=kegiatans&order=created_at,desc`;
      console.log("url", url);
      const response = await httpClient(url);
      console.log("response", response);
      let json = await response.json();
      console.log("json", json);

      let kegiatan = [];
      for (let index = 0; index < json.records.length; index++) {
        let element1 = json.records[index]["id_kegiatan"];
        let element2 = {"is_sudah_absen": json.records[index]["is_sudah_absen"]};
        // console.log("element2", element2);
        let element ={...element1, ...element2}
        kegiatan.push(element);
      }
      json = kegiatan;
      console.log("json_kegiatan", json);

      Promise.resolve()
        // .then(() => { setBmns((prevBmns) => [...prevBmns, ...json.records]); })
        .then(() => { setBmns((prevBmns) => [...prevBmns, ...json]); })
        .then(() => { setPage((prevPage) => prevPage + 1); })
        .then(() => { setMaxBMN(json.results); });


      console.log(url);
      // console.log("BMN", json.records)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

  };

  // useEffect(() => {
  //   fetchBmns(0, INITIAL_BMNS_COUNT, page);
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async()=>{
        setBmns([]);
        fetchBmns(0, INITIAL_BMNS_COUNT, page);
      
      })();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <Card>
        <View style={{ width: "100%", height: 70, backgroundColor: "white", display: "flex", justifyContent: "center", padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", display: !showSearch ? "flex" : "none" }}>
            <Icon name="file-tree-outline" size={18} color="black" />
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Kegiatan</Text>
          </View>
          {showSearch ?
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Icon name="arrow-left" size={20} color="black" onPress={() => { setShowSearch(false) }} />
              <TextInput
                style={{ flex: 1, height: 40, backgroundColor: "#e8e8e8", padding: 10, marginLeft: 10 }}
                // onChangeText={onChangeNumber}
                // value={number}
                placeholder="Search BMN"
                keyboardType="default"
              />
              <TouchableOpacity activeOpacity={1.0} style={{ height: 40, width: 40, backgroundColor: "#e8e8e8", justifyContent: "center" }}>
                <Icon name="close" size={20} color="black" />
              </TouchableOpacity>

            </View> : null
          }
          <TouchableOpacity style={{ display: !showSearch ? "flex" : "none" }} onPress={() => { setShowSearch(true) }}>
            <Icon name="magnify" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </Card>

      <View style={{ marginTop: 5 }}>
        <View style={{
          width: "100%", height: 70, backgroundColor: "white", display: "flex",
          justifyContent: "center", padding: 15, flexDirection: "row", justifyContent: "space-between",
          alignItems: "center"
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="sort-ascending" size={16} color="black" />
            {/* <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Items</Text> */}
            <Text style={{ marginLeft: 5 }} onPress={createTwoButtonAlert} >Name</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* {isLoading ? <ActivityIndicator size="small" /> : null} */}
            <Icon name="apps" size={20} color="black" onPress={createTwoButtonAlert} />
          </View>
        </View>
      </View>
      {/* {isLoading ? <ActivityIndicator size="large" /> : null} */}

      <SafeAreaView style={{ marginBottom: 20 }}>
        {/* https://codesandbox.io/s/jeopt */}
        <FlatList
          data={bmns}
          // keyExtractor={(item) => item.id_kegiatan}
          keyExtractor={(item) => item.id}
          // onEndReached={() => { }}
          // onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <TouchableOpacity style={{
              width: "100%", backgroundColor: "white", display: "flex",
              justifyContent: "center", padding: 10, flexDirection: "row", justifyContent: "flex-start",
              alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#e8e8e8"
            }} onPress={()=>{handlePresentModalPress(); setSelectedBmnId(item.id); setSelectedBmn(item); }} >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ width: 80, height: 80, alignSelf: "center" }}
                  // source={{ uri: 'https://sultradata.com/project/bmn-api/images/no_image.jpg' }}
                  source={require("../images/workshop.png")}
                />
              </View>
              <View style={{ padding: 10, flex: 1 }}>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginTop: 5, marginBottom: 10 }}>{item.title}</Text>
                {/* <Text>{item.start}</Text> */}
                <Text>{getTimeAgo(item.start)}</Text>
                <View style={{width: "100%", flexDirection:"row", justifyContent: "space-between"}}>
                  <Text>{item.start_jam+" WITA"}</Text>
                  <Text style={{color: item.is_sudah_absen? "green":"red"}}>{item.is_sudah_absen? "Sudah Absen":"Belum Absen"}</Text>
                </View>
              </View>
            </TouchableOpacity>

          )}
          ListFooterComponent={
            isLoading ?
              <View style={{ height: 200, backgroundColor: "white" }}>
                <ActivityIndicator size="large" />
              </View> : null
          }
        />
        {/* {isLoading ? <ActivityIndicator size="large" /> : null} */}
      </SafeAreaView>

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
                  source={require("../images/workshop.png")}
                />
                <View style={{ paddingHorizontal: 10, flex: 1 }}>
                  <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>{selectedBmn.title}</Text>
                  {/* <Text>{selectedBmn.agenda}</Text> */}
                </View>
              </View>

              <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }}
                  onPress={() => {
                    bottomSheetModalRef.current?.dismiss();
                    navigation.navigate('Detailk', {
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
                    navigation.navigate('Camera');
                  }}
                >
                  <View style={{ width: 20 }}>
                    <Icon name="camera" size={16} color="black" />
                  </View>
                  <Text style={{ color: "black", marginLeft: 10 }}>Scan Absen</Text>
                </TouchableOpacity>
              </View>

            </View>
          </BottomSheetModal>

        </BottomSheetModalProvider>

      </Portal>



    </View>
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
    // padding: 20
    //   alignItems: 'center',
  },
});

export default KegiatanScreen
