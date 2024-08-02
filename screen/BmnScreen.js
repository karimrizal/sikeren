import { View, Text, Button, Image, SafeAreaView, FlatList, ActivityIndicator, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import { createTwoButtonAlert, getLoginUser, httpClient, url_api } from '../constant/constant';
import { Portal } from '@gorhom/portal';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CustomBackdrop from '../constant/CustomBackDrop';
import Modal from 'react-native-modal';
import RadioGroup from 'react-native-radio-buttons-group';

// const MAX_BMNS = 50;
const INITIAL_BMNS_COUNT = 10;
const FETCH_BMNS_COUNT = 10;


function BmnScreen({ navigation }) {
  const [bmns, setBmns] = useState([]);
  const [myBmns, setMyBmns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [MAX_BMNS, setMaxBMN] = useState(50);
  const [showSearch, setShowSearch] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');


  const handleConfirm = () => {
    setIsModalVisible(false);
    // Do something with the selected option
    console.log('Selected option:', selectedId);
    setSelectedIdConfirm(selectedId);
  };

  const radioButtons = useMemo(() => ([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Tampilkan Semua BMN',
      value: 'option1'
    },
    {
      id: '2',
      label: 'Tampilkan BMN Saya',
      value: 'option2'
    }
  ]), []);

  const [selectedId, setSelectedId] = useState('1');
  const [selectedIdConfirm, setSelectedIdConfirm] = useState('1');

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
      if(index==-1){
        setShowBackdrop(false);
      }
  }, []);

  const [selectedBmnId, setSelectedBmnId] = useState(0);
  const [selectedBmn, setSelectedBmn] = useState({});

  const fetchBmns = async (length, count, page) => {
    if (length >= MAX_BMNS) return;
    if (isLoading&&length>0) return;
    if (!isLoading) await setIsLoading(true);

    try {
      let url = url_api+"/records/bmns?"+`page=${page},${count}`;
      const response = await httpClient(url);
      const json = await response.json();
      Promise.resolve()
      .then(() => { setBmns((prevBmns) => [...prevBmns, ...json.records]); })
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

  const fetchMyBmns = async (length, count, page) => {
    let data= await getLoginUser();

    if (length >= MAX_BMNS) return;
    if (isLoading&&length>0) return;
    if (!isLoading) await setIsLoading(true);

    try {
      let url = url_api+"/records/view_bmn_last_position?"+`filter=niplama,eq,${data[0].nip}`;
      const response = await httpClient(url);
      const json = await response.json();
      // Promise.resolve()
      // .then(() => { setBmns((prevBmns) => [...prevBmns, ...json.records]); })
      // .then(() => { setPage((prevPage) => prevPage + 1); })
      // .then(() => { setMaxBMN(json.results); });

      console.log("MY BMN", json.records);
      setMyBmns(json.records);


      console.log(url);
      // console.log("BMN", json.records)
    } catch (error) {
        console.error(error);
    } finally {
        // setIsLoading(false);
    }

  };

  useEffect(() => {
    fetchBmns(0, INITIAL_BMNS_COUNT, page);
    fetchMyBmns(0, INITIAL_BMNS_COUNT, page);
    
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Card>
        <View style={{ width: "100%", height: 70, backgroundColor: "white", display: "flex", justifyContent: "center", padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", display: !showSearch? "flex": "none" }}>
            <Icon name="file-tree-outline" size={18} color="black" />
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Items</Text>
          </View>
          {showSearch? 
          <View style={{flex:1, flexDirection: "row", alignItems: "center"}}>
            <Icon name="arrow-left" size={20} color="black" onPress={()=>{setShowSearch(false)}} />
            <TextInput
              style={{flex:1, height: 40, backgroundColor: "#e8e8e8", padding:10, marginLeft: 10 }}
              // onChangeText={onChangeNumber}
              // value={number}
              placeholder="Search BMN"
              keyboardType="default"
            />
            <TouchableOpacity activeOpacity={1.0} style={{height:40, width: 40, backgroundColor: "#e8e8e8", justifyContent: "center"}}>
              <Icon name="close" size={20} color="black" />
            </TouchableOpacity>
            
          </View>: null
          }
          <TouchableOpacity style={{display: !showSearch? "flex": "none"}} onPress={()=>{setShowSearch(true)}}>
            <Icon name="magnify" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </Card>

      <View style={{marginTop: 5}}>
        <View style={{ width: "100%", height: 70, backgroundColor: "white", display: "flex", 
          justifyContent: "center", padding: 15, flexDirection: "row", justifyContent: "space-between", 
          alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="sort-ascending" size={16} color="black" />
            {/* <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>Items</Text> */}
            <Text style={{marginLeft:5}} onPress={createTwoButtonAlert} >Name</Text>
          </View>
          <View style={{flexDirection: "row", alignItems:"center"}}>
            {/* {isLoading ? <ActivityIndicator size="small" /> : null} */}
            <Icon name="apps" size={20} color="black" onPress={()=>{setIsModalVisible(true);}} />
          </View>
        </View>
      </View>
      {/* {isLoading ? <ActivityIndicator size="large" /> : null} */}

      <SafeAreaView style={{marginBottom: 20}}>
        {/* https://codesandbox.io/s/jeopt */}
        {
          // All BMN
          (selectedIdConfirm=='1')&&
          <FlatList
            data={bmns}
            keyExtractor={(item) => item.id}
            onEndReached={() => fetchBmns(bmns.length, FETCH_BMNS_COUNT, page)}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
                <TouchableOpacity style={{ width: "100%", backgroundColor: "white", display: "flex", 
                  justifyContent: "center", padding: 10, flexDirection: "row", justifyContent: "flex-start",
                  alignItems: "center", borderBottomWidth:1, borderBottomColor:"#e8e8e8" }} onPress={()=>{handlePresentModalPress(); setSelectedBmnId(item.id); setSelectedBmn(item); }} >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      style={{ width: 80, height: 80, alignSelf: "center" }}
                      source={{ uri: item.image_path==null? 'https://sultradata.com/project/bmn-api/images/no_image.jpg':'https://sultradata.com/project/bmn-api/images/'+item.image_path}}
                    />
                  </View>
                  <View style={{padding:10, flex: 1}}>
                    {/* <Text>{item.id}</Text> */}
                    <Text>{item.kode_barang+"-"+item.nup}</Text>
                    <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{item.merk}</Text>
                    <Text>{item.nama_barang}</Text>
                    {/* <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>Pemadam kebakaran ringan fire extenguisher CO2 kdfhgdfgdfg dgd</Text> */}
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
        }

        {
          // My BMN 
          (selectedIdConfirm=='2'&&myBmns.length==0)&&
          <Text style={{color: "black", fontWeight: "bold", margin: 20}}>Anda tidak mempunyai list barang BMN. Silahkan melakukan claim barang BMN di menu claim BMN jika 
            anda memegang barang BMN.</Text>

        }

        {
          // My BMN
          (selectedIdConfirm=='2')&&
          <FlatList
            data={myBmns}
            keyExtractor={(item) => item.id}
            // onEndReached={() => fetchMyBmns(bmns.length, FETCH_BMNS_COUNT, page)}
            // onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
                <TouchableOpacity style={{ width: "100%", backgroundColor: "white", display: "flex", 
                  justifyContent: "center", padding: 10, flexDirection: "row", justifyContent: "flex-start",
                  alignItems: "center", borderBottomWidth:1, borderBottomColor:"#e8e8e8" }} onPress={()=>{handlePresentModalPress(); setSelectedBmnId(item.id_bmn); setSelectedBmn(item); }} >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      style={{ width: 80, height: 80, alignSelf: "center" }}
                      source={{ uri: item.image_path==null? 'https://sultradata.com/project/bmn-api/images/no_image.jpg':'https://sultradata.com/project/bmn-api/images/'+item.image_path}}
                    />
                  </View>
                  <View style={{padding:10, flex: 1}}>
                    {/* <Text>{item.id}</Text> */}
                    <Text>{item.kode_barang+"-"+item.nup}</Text>
                    <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>{item.merk}</Text>
                    <Text>{item.nama_barang}</Text>
                    {/* <Text style={{color: "black", fontWeight: "bold", fontSize:16, marginTop: 10, marginBottom: 10}}>Pemadam kebakaran ringan fire extenguisher CO2 kdfhgdfgdfg dgd</Text> */}
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
        }
        {/* {isLoading ? <ActivityIndicator size="large" /> : null} */}

        <Modal visible={isModalVisible}>
          <View style={{ borderWidth: 1, borderColor: "grey", backgroundColor: 'white', borderStyle:"solid", padding: 20 }}>
            <Text style={{ marginBottom: 20 }}>Pilih opsi filter:</Text>
            <RadioGroup
              // radioButtons={options}
              // onPress={(value) => handleSelectOption(value)}
              // layout="column"
              // flexDirection="row"
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
              containerStyle={{ alignItems: "flex-start" }}

            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => {setIsModalVisible(false); setSelectedId(selectedIdConfirm)}}>
                <Text style={{ color: 'red', marginTop: 20, marginLeft: 20 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={{ color: 'blue', marginTop: 20, marginLeft: 20 }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
                    // navigation.navigate('Claim');
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
                    // navigation.navigate('Claim');
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
                    // navigation.navigate('Claim');
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

export default BmnScreen
