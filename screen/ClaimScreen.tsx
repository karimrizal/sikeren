import * as React from 'react';
import { StyleSheet, SafeAreaView, View, Image, ScrollView, Text, PermissionsAndroid, Alert } from 'react-native';
import { DemoTitle, DemoButton, DemoResponse } from './components';

import * as ImagePicker from 'react-native-image-picker';
import { getLoginUser, httpClient, url_api } from '../constant/constant';

/* toggle includeExtra */
const includeExtra = true;

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission granted');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}



export default function ClaimScreen({ route, navigation }) {
  const { bmnId } = route.params;
  const [response, setResponse] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [history, setHistory] = React.useState([]);


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

      // if(jsonArray.length>0){
      //   setSelectedPegawaiAwal(jsonArray[0].niplama);
      // }
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  }

  const onButtonPress = React.useCallback(async (type, options) => {
    if(history.length>0){
      Alert.alert("Notifikasi", "Gagal claim, BMN sudah pernah diclaim!");
      console.log("CLAIM", "Gagal claim!");
      return;
    }


    console.log("BMN ID", bmnId);
    if (type === 'capture') {
      requestCameraPermission();
      // ImagePicker.launchCamera(options, setResponse);

      ImagePicker.launchCamera(options, async (response) => {
        setResponse(response);
        if (response.assets) {
          let selectedImage = response.assets[0];
          const datas = new FormData();
          datas.append('fileToUpload', {
            name: selectedImage.fileName,
            type: selectedImage.type,
            uri:
              Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', ''),
          });
          datas.append("bmnid", bmnId);

          let ld= await getLoginUser();
          datas.append("niplama", ld[0].nip);
          // console.log("data", JSON.stringify(datas));
          // setData(JSON.stringify(selectedImage));

          fetch('https://sultradata.com/project/bmn-api/upload.php', {
            method: 'POST',
            body: datas,
          })
            .then((response) => response.text())
            .then((result) => {
              console.log('Success:', result);
              Alert.alert("Notifikasi", "BMN berhasil diclaim!");
            })
            .catch((error) => {
              console.error('Error:', error);
              Alert.alert("Notifikasi", "Error melakukan claim BMN !");
            });
        }

      });

    } else {
      // ImagePicker.launchImageLibrary(options, setResponse);
      // https://stackoverflow.com/questions/65838973/how-to-upload-image-from-react-native-image-picker-with-axios
      ImagePicker.launchImageLibrary(options, async (response) => {
        setResponse(response);
        if (response.assets) {
          let selectedImage = response.assets[0];
          const datas = new FormData();
          datas.append('fileToUpload', {
            name: selectedImage.fileName,
            type: selectedImage.type,
            uri:
              Platform.OS === 'android' ? selectedImage.uri : selectedImage.uri.replace('file://', ''),
          });
          datas.append("bmnid", bmnId);

          let ld= await getLoginUser();
          datas.append("niplama", ld[0].nip);
          // console.log("data", JSON.stringify(datas));
          // setData(JSON.stringify(selectedImage));

          fetch('https://sultradata.com/project/bmn-api/upload.php', {
            method: 'POST',
            body: datas,
          })
            .then((response) => response.text())
            .then((result) => {
              console.log('Success:', result);
              Alert.alert("Notifikasi", `BMN ${bmnId} berhasil diclaim!`);
            })
            .catch((error) => {
              console.error('Error:', error);
              Alert.alert("Notifikasi", `Error melakukan claim BMN ${bmnId}!`);
            });
        }

      });

    }
  }, []);

  React.useEffect(() => {
    getHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DemoTitle>🌄 Claim BMN {bmnId}</DemoTitle>
      {history.length>0 &&
        <Text style={{color: "black", fontWeight: "bold", fontSize:15, marginTop: 10, marginBottom: 10, marginLeft: 10}}>{"BMN berikut sudah pernah diclaim!"}</Text>
      }
      <ScrollView>
        <View style={styles.buttonContainer}>
          {actions.map(({ title, type, options }) => {
            return (
              <DemoButton
                disabled={history.length>0}
                key={title}
                onPress={() => onButtonPress(type, options)}>
                {title}
                
              </DemoButton>
            );
          })}
        </View>
        <DemoResponse>{response}</DemoResponse>
        <Text>{data}</Text>

        {response?.assets &&
          response?.assets.map(({ uri }: { uri: string }) => (
            <View key={uri} style={styles.imageContainer}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.image}
                source={{ uri: uri }}
              />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  // {
  //   title: 'Take Video',
  //   type: 'capture',
  //   options: {
  //     saveToPhotos: true,
  //     mediaType: 'video',
  //     includeExtra,
  //   },
  // },
  // {
  //   title: 'Select Video',
  //   type: 'library',
  //   options: {
  //     selectionLimit: 0,
  //     mediaType: 'video',
  //     includeExtra,
  //   },
  // },
  // {
  //   title: `Select Image or Video\n(mixed)`,
  //   type: 'library',
  //   options: {
  //     selectionLimit: 0,
  //     mediaType: 'mixed',
  //     includeExtra,
  //   },
  // },
];