import { View, Text, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { HelperText, TextInput, Button } from 'react-native-paper'
import DateTimePickerInput from './components/DateTimePickerInput'
// import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
// import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import MultiSelect from './components/custom/react-native-multi-select';
import { useFocusEffect } from '@react-navigation/native';
import { getLoginUser, url_notify, url_sikeren_android } from '../constant/constant';


const CreateRapatScreen = ({navigation}) => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItems2, setSelectedItems2] = useState([]);
    
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);

    const [isError1, setIsError1] = useState(false);
    const [isError2, setIsError2] = useState(false);
    const [isError3, setIsError3] = useState(false);
    const [isError4, setIsError4] = useState(false);
    const [isError5, setIsError5] = useState(false);
    const [isError6, setIsError6] = useState(false);
    
    
    const [topik, setTopik] = useState("");
    const [agenda, setAgenda] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);

    const handleDateChange = (selectedDate) => {
        // Do something with the selected date
        console.log('Selected date:', selectedDate);
        setDateStart(selectedDate);
    };

    const handleDateChangeEnd = (selectedDate) => {
        // Do something with the selected date
        console.log('Selected date:', selectedDate);
        setDateEnd(selectedDate);
    };

    onSelectedItemsChange = selectedItems => {
        // this.setState({ selectedItems });
        setSelectedItems(selectedItems);
        console.log(selectedItems);
    };

    onSelectedItemsChange2 = selectedItems2 => {
        // this.setState({ selectedItems });
        setSelectedItems2(selectedItems2);
        console.log(selectedItems2);
    };

    const validateForm = () => {
        console.log(topik);
        let error = 0;
        if(selectedItems.length==0){
            setIsError1(true);
            error++;
        }else{
            setIsError1(false);
        }

        if(topik.trim().length==0){
            setIsError2(true);
            error++;
        }else{
            setIsError2(false);
        }

        if(agenda.trim().length==0){
            setIsError3(true);
            error++;
        }else{
            setIsError3(false);
        }

        if(dateStart==null){
            setIsError4(true);
            error++;
        }else{
            setIsError4(false);
        }

        if(dateEnd==null){
            setIsError5(true);
            error++;
        }else{
            setIsError5(false);
        }

        if(selectedItems2.length==0){
            setIsError6(true);
            error++;
        }else{
            setIsError6(false);
        }

        if(error==0){
            return true;
        }
        
        return false;
    };

    useFocusEffect(
        React.useCallback(() => {
          (async()=>{
            let akun= await getLoginUser();
            let token = akun[0].token;
            // let req = await fetch('https://sso.bps.go.id/auth/realms/pegawai-bps/api-pegawai', {
            //     headers: {Authentication: `Bearer ${token}`}
            // });

            // let req = await fetch('https://sso.bps.go.id/auth/realms/pegawai-bps/api-pegawai');
            let req = await fetch('https://webapps.bps.go.id/sultra/sikeren/pegawai.php');

            let data = await req.json();

            // console.log("data", data);
            let temp = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let pegawai = {
                    id: element["attributes"]["attribute-nip-lama"][0],
                    name: element["attributes"]["attribute-nama"][0]
                }
                temp.push(pegawai);
            }
            console.log(temp);
            setItems(temp);
            setIsLoading(false);

            
          
          })();
        }, [])
    );
    return (
        <View style={{ flex: 1, padding: 10 }}>
            <ScrollView>
                
                <Text style={{ marginBottom: 10, color: "black", fontSize: 15 }}>Tambah Kegiatan</Text>
                <View>
                    <MultiSelect
                        // hideTags
                        items={items}
                        uniqueKey="id"
                        // ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={onSelectedItemsChange}
                        selectedItems={selectedItems}
                        selectText="Pilih Peserta Rapat"
                        // searchInputPlaceholderText="Search Items..."
                        // onChangeInput={ (text)=> console.log(text)}
                        // altFontFamily="ProximaNova-Light"
                        // tagRemoveIconColor="#CCC"
                        // tagBorderColor="#CCC"
                        // tagTextColor="#CCC"
                        // selectedItemTextColor="#CCC"
                        // selectedItemIconColor="#CCC"
                        // itemTextColor="#000"
                        // displayKey="name"
                        // searchInputStyle={{ color: '#CCC' }}
                        // submitButtonColor="#CCC"
                        submitButtonText="Add"
                        style={{marginBottom: 20, padding:10}}
                    />
                    <HelperText type="error" style={{display: isError1? "flex":"none", marginTop: -10, marginBottom: 10}}>
                        Peserta Rapat harus terisi
                    </HelperText>

                </View>
                <View>
                    <TextInput onChangeText={setTopik} label="Topik Rapat" mode="outlined"  style={{ marginBottom: 10 }}></TextInput>
                    <HelperText type="error" style={{display: isError2? "flex":"none", marginTop: -10, marginBottom: 10}}>
                        Topik Rapat harus terisi
                    </HelperText>
                </View>
                <View>
                    <TextInput onChangeText={setAgenda} label="Agenda Rapat" mode="outlined" style={{ marginBottom: 10 }}></TextInput>
                    <HelperText type="error" style={{display: isError3? "flex":"none", marginTop: -10, marginBottom: 10}}>
                        Agenda Rapat harus terisi
                    </HelperText>
                </View>
                <View>
                    <DateTimePickerInput label="Waktu Mulai" onChange={handleDateChange} style={{ marginBottom: 10 }}></DateTimePickerInput>
                    <HelperText type="error" style={{display: isError4? "flex":"none", marginTop: -10, marginBottom: 10}}>
                        Waktu Mulai harus terisi
                    </HelperText>
                </View>
                <View>
                    <DateTimePickerInput label="Waktu Selesai" onChange={handleDateChangeEnd} style={{ marginBottom: 10 }}></DateTimePickerInput>
                    <HelperText type="error" style={{display: isError5? "flex":"none", marginTop: -10, marginBottom: 10}}>
                        Waktu Selesai harus terisi
                    </HelperText>
                </View>
                <View>
                    <MultiSelect
                        // hideTags
                        single={true}
                        items={items}
                        uniqueKey="id"
                        onSelectedItemsChange={onSelectedItemsChange2}
                        selectedItems={selectedItems2}
                        selectText="Pemimpin Rapat"
                        submitButtonText="Add"
                        style={{marginBottom: 20, padding:10}}
                    />
                    <HelperText type="error" style={{display: isError6? "flex":"none", marginTop: -10, marginBottom: 10}}>
                        Pemimpin Rapat harus terisi
                    </HelperText>
                </View>

                <Button loading={isLoading} disabled={isLoading} icon="send" mode="contained" 
                    onPress={async () => {
                        if(validateForm()){
                            setIsLoading(true);
                            console.log("YA benar");
                            let pemimpin = items.filter(item => selectedItems2.includes(item.id));

                            let datenow = new Date();

                            let data = {
                                title: topik,
                                agenda: agenda,
                                pemimpin: pemimpin[0].name,
                                start: dateStart.toISOString().slice(0, 10),
                                end: dateEnd.toISOString().slice(0, 10),
                                start_jam: dateStart.toTimeString().split(' ')[0],
                                end_jam: dateEnd.toTimeString().split(' ')[0],
                                jenis: "Rapat",
                                created_at: datenow.toISOString().replace("T"," ").substring(0, 19),
                                updated_at: datenow.toISOString().replace("T"," ").substring(0, 19)
                            }

                            console.log(data);
                            const response = await fetch(url_sikeren_android+"/records/kegiatans", {
                                method: "POST", // or 'PUT'
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                            });

                            const result = await response.text();
                            console.log("result", result);

                            let data2 = [];
                            for (let index = 0; index < selectedItems.length; index++) {
                                const element = selectedItems[index];
                                // console.log(element);
                                let temp = {
                                    id_kegiatan: result,
                                    niplama:element,
                                    is_sudah_absen: 0,
                                    created_at: datenow.toISOString().replace("T"," ").substring(0, 19),
                                    updated_at: datenow.toISOString().replace("T"," ").substring(0, 19)
                                }
                                data2.push(temp);
                                
                            }

                            console.log(data2);
                            const response2 = await fetch(url_sikeren_android+"/records/penugasans", {
                                method: "POST", // or 'PUT'
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data2),
                            });

                            const result2 = await response2.json();
                            console.log("result", result2);

                            //notify api here
                            let data3 = {
                                message_title: topik,
                                message_content: agenda,
                                id_kegiatan: result2
                            }

                            // console.log("data3", data3);

                            // const response3 = await fetch(url_notify, {
                            //     method: "POST", // or 'PUT'
                            //     headers: {
                            //         "Content-Type": "application/json",
                            //     },
                            //     body: JSON.stringify(data3),
                            // });

                            // const result3 = await response3.text();
                            // console.log(result3);

                            fetch(url_notify, {
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
                                    console.log(data);
                                    Alert.alert(
                                        "Success",
                                        "Berhasil menambahkan rapat",
                                        [
                                            { text: "OK", onPress: () => navigation.navigate("Home") }
                                        ]
                                    );
                                })
                                .catch(error => {
                                    // Handle any errors that occurred during the request
                                    console.error('Error:', error);
                                    Alert.alert(
                                        "Warning",
                                        "Gagal menambahkan rapat",
                                        [
                                            { text: "OK", onPress: () => console.log(error) }
                                        ]
                                    );
                                }).finally(()=>{
                                    setIsLoading(false);
                                });
                           
                        }

                    }}
                >
                    SUBMIT
                </Button>
                
                
                 {/* <Button title='Submit' 
                     onPress={()=>{
                         // console.log(dateStart.toLocaleDateString()+" "+dateStart.toLocaleTimeString());
                         if(validateForm()){
                             console.log("YA benar");
                            
                         }
                        
                     }}
                 /> */}
            </ScrollView>
            {/* <RNDateTimePicker value={new Date()} mode='time'></RNDateTimePicker> */}
        </View>
    )
}

export default CreateRapatScreen