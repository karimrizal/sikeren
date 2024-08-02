import * as React from 'react';
import { runOnJS } from 'react-native-reanimated';

import { StyleSheet, Text, Image, View } from 'react-native';
import {
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { scanQRCodes, QrCode } from 'vision-camera-qrcode-scanner';
import { bmnAlert } from '../constant/constant';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [qrCodes, setQrCodes] = React.useState([]);
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const qrcode = scanQRCodes(frame);
    runOnJS(setQrCodes)(qrcode);
    // console.log(qrcode);
    // console.log(qrcode[0].rawValue);
    // if(qrcode.length>0&&!isAlertVisible){
    //   bmnAlert("QRCODE = "+qrcode[0]);
    //   setIsAlertVisible(true);
    // }
  }, []);

  return (
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        {qrCodes.map((qrcode, idx) => (
          <Text key={idx} style={styles.qrCodeTextURL}>
            {qrcode.url}
          </Text>
        ))}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <Image
                style={{ width: 300, height: 300 }} 
                source={require("../images/camera-focus.png")}
            />
            <Text style={styles.qrCodeTextURL}>
              {qrCodes[0]?.rawValue}
            </Text>

          </View>

        </View>
      </>
    )
  );
}

const styles = StyleSheet.create({
  qrCodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: "center"
  },
});
